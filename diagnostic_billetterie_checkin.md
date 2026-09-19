# Rapport de Diagnostic : Module Billetterie, Validation & Check-in

> **Projets concernés** :
> - **Backend** : `jump-in` (NestJS / Prisma / PostgreSQL)
> - **Frontend** : `runhub` (React Native / Expo SDK 56)
> **Date du diagnostic** : Septembre 2026

---

## 1. Vue d'Ensemble de l'Architecture

Le module de billetterie et de validation d'entrées repose sur une interaction directe entre l'application mobile de l'utilisateur (détenteur du billet), l'application mobile de l'organisateur (contrôleur d'accès) et l'API NestJS.

```
┌─────────────────────────────────────────────────────────┐
│              Application Mobile (Participant)           │
│  - TicketDetailScreen : affichage billet + code unique  │
└───────────────────────────┬─────────────────────────────┘
                            │ Présentation (QR / Code 8 car.)
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Application Mobile (Organisateur)          │
│  - QrScannerScreen : scan caméra temps réel (Expo Camera)│
│  - CheckInListScreen : liste participants, stats, toggle│
└───────────────────────────┬─────────────────────────────┘
                            │ Requêtes API sécurisées
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (Jump-In)                    │
│  - EventOrganizerGuard : contrôle des droits d'accès    │
│  - RegistrationsController & Service : logique métier   │
│  - Prisma ORM / PostgreSQL : table `registrations`      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Inventaire des Fichiers Clés

### Backend (`jump-in`)
- `src/events/registrations/registrations.controller.ts` : Points d'entrée de l'API (scan, check-in manuel, liste participants, statut).
- `src/events/registrations/registrations.service.ts` : Génération du code billet, inscription, validation du scan et bascule de statut.
- `src/events/guards/event-organizer.guard.ts` : Guard d'autorisation (Organisateur, Admin Club, Super Admin).
- `src/events/registrations/dto/scan-ticket.dto.ts` : DTO de validation de la charge utile de scan.
- `prisma/schema.prisma` : Modèle `Registration` (champs `ticketCode`, `status`, `checkedInAt`, `checkedInById`).

### Frontend Mobile (`runhub`)
- `src/features/tickets/screens/TicketDetailScreen.tsx` : Affichage du billet numérique par le participant.
- `src/features/check-in/screens/QrScannerScreen.tsx` : Écran de scan par caméra avec gestion des retours (Valide, Déjà scanné, Invalide).
- `src/features/check-in/screens/CheckInListScreen.tsx` : Roster des participants, jauge d'avancement, recherche et toggle unitaire.
- `src/features/events/api/events.api.ts` : Définition des appels API (`scanTicket`, `toggleCheckIn`, `getParticipants`).
- `src/features/events/hooks/useEvents.ts` : Hooks TanStack Query (`useScanTicket`, `useToggleCheckIn`, `useEventParticipants`).

---

## 3. Points Forts de l'Implémentation Actuelle

1. **Sécurisation des accès (RBAC)** :
   L'utilisation de `EventOrganizerGuard` garantit qu'un utilisateur standard ne peut pas valider de billets pour un événement dont il n'est ni l'organisateur ni l'administrateur du club associé.
2. **Codes de secours sans ambiguïté** :
   La méthode `generateTicketCode()` produit un code à 8 caractères en excluant les caractères ambigus (`0`, `O`, `1`, `I`), facilitant la saisie manuelle en cas d'écran fissuré ou de problème de caméra.
3. **Gestion des états de scan claire côté UX** :
   Le scanner gère distinctement 3 états de réponse :
   - `valid` : Billet valide, participant marqué comme arrivé.
   - `already_used` : Billet déjà composté (alerte orange).
   - `invalid` : Billet inconnu ou appartenant à un autre événement (alerte rouge).
4. **Double mode de pointage** :
   Possibilité de scanner en continu via la caméra ou de pointer manuellement depuis la liste des inscrits avec recherche instantanée.

---

## 4. Diagnostics des Vulnérabilités & Anomalies

### 🔴 1. Le QR Code du billet est une icône vectorielle statique (Critique)
- **Localisation** : `runhub/src/features/tickets/screens/TicketDetailScreen.tsx` (Ligne 90)
- **Problème** : Le composant rend `<Ionicons name="qr-code" size={160} color={Colors.light.text} />`. Il s'agit d'une simple icône graphique et non d'une matrice 2D encodant la valeur `ticketCode`.
- **Conséquence** : La caméra d'un organisateur ne peut rien décoder. L'organisateur est systématiquement contraint de basculer sur la saisie manuelle du code à 8 caractères.
- **Correction recommandée** :
  Installer et intégrer une bibliothèque de rendu QR Code (ex: `react-native-qrcode-svg` ou générateur SVG) injectant directement la valeur dynamique `ticketCode`.

---

### 🟠 2. Validation possible des inscriptions impayées `PENDING` (Majeur)
- **Localisation** : `jump-in/src/events/registrations/registrations.service.ts` (`scanTicket` Lignes 378-405)
- **Problème** : La méthode `scanTicket` vérifie uniquement que l'inscription n'est pas `CANCELLED` et pas déjà `CHECKED_IN`. Si l'événement est payant et que le paiement n'a pas abouti (`status === PENDING`), le scan valide tout de même l'entrée et passe le statut en `CHECKED_IN`.
- **Conséquence** : Risque de fraude ou de perte financière en laissant entrer des participants dont le paiement n'est pas validé.
- **Correction recommandée** :
  Ajouter un contrôle sur le statut de paiement pour les événements payants :
  ```typescript
  if (registration.status === RegistrationStatus.PENDING) {
    throw new BadRequestException('Paiement en attente : ce billet n\'est pas encore réglé.');
  }
  ```

---

### 🟡 3. Risque de Race Condition lors de scans multi-portes simultanés (Moyen)
- **Localisation** : `jump-in/src/events/registrations/registrations.service.ts` (`scanTicket`)
- **Problème** : `scanTicket` effectue une lecture `findFirst` suivie d'un `update` sans verrouillage pessimiste ni clause de mise à jour conditionnelle atomique.
- **Conséquence** : Si deux contrôleurs scannent le même billet au même millième de seconde à deux portes différentes, les deux requêtes liront `status !== CHECKED_IN` et valideront le billet en double.
- **Correction recommandée** :
  Effectuer une mise à jour conditionnelle atomique :
  ```typescript
  const result = await this.prisma.registration.updateMany({
    where: {
      id: registration.id,
      status: { not: RegistrationStatus.CHECKED_IN },
    },
    data: {
      status: RegistrationStatus.CHECKED_IN,
      checkedInAt: new Date(),
      checkedInById: currentUserId,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      status: 'already_used',
      message: 'Ce billet a déjà été validé à l\'instant.',
    };
  }
  ```

---

### 🟡 4. Absence de standardisation du format de charge QR (Moyen)
- **Localisation** : `runhub/src/features/check-in/screens/QrScannerScreen.tsx` et `jump-in/src/events/registrations/dto/scan-ticket.dto.ts`
- **Problème** : Le scanner transmet la chaîne brute scannée. Si le QR code est enrichi (ex: URL `https://runhub.app/tickets/7KB9QD2A` ou JSON `{ eventId, ticketCode }`), le backend échouera lors de la recherche exacte.
- **Correction recommandée** :
  Normaliser le payload du QR Code (ex: JSON `{ "t": "RUNHUB", "c": "7KB9QD2A", "e": "uuid" }`) ou ajouter une fonction d'extraction/sanitisation regex côté client avant envoi.

---

### 🟢 5. Manque de feedback haptique et mode rafale (Ergonomie)
- **Localisation** : `runhub/src/features/check-in/screens/QrScannerScreen.tsx`
- **Problème** :
  - Absence de vibration haptique (succès vs erreur) lors du scan, ralentissant le travail des organisateurs dans un environnement bruyant.
  - Obligation de cliquer manuellement sur "Scanner le suivant" après chaque scan.
- **Correction recommandée** :
  - Intégrer `expo-haptics` (`Haptics.notificationAsync(NotificationFeedbackType.Success)`).
  - Ajouter un bouton bascule "Scan continu" réarmant automatiquement la caméra après 1,5 seconde.

---

## 5. Matrice des Actions Correctives

| ID | Priorité | Tâche | Fichiers cibles |
| :--- | :---: | :--- | :--- |
| **ACT-01** | 🔴 P1 | Remplacer l'icône statique par un générateur de QR code dynamique | `TicketDetailScreen.tsx` |
| **ACT-02** | 🟠 P2 | Bloquer le scan des billets au statut `PENDING` (impayés) | `registrations.service.ts` |
| **ACT-03** | 🟡 P3 | Sécuriser la validation atomique anti-concurrence | `registrations.service.ts` |
| **ACT-04** | 🟡 P4 | Standardiser et assainir la charge utile du QR code | `QrScannerScreen.tsx`, `scan-ticket.dto.ts` |
| **ACT-05** | 🟢 P5 | Ajouter le retour haptique et une option de scan continu | `QrScannerScreen.tsx` |
