# 📋 Plan d'Optimisation Produit & Simplification Ergonomique (RunHub)

Ce document présente l'audit critique des fonctionnalités actuelles de **RunHub / Jump-In** et la feuille de route pour traiter **une par une** les recommandations d'optimisation afin d'offrir une expérience utilisateur fluide, performante et adaptée aux habitudes locales.

---

## 🎯 Vision Globale & Objectifs

1. **Éliminer la dette technique et les fonctionnalités fictives** (ex: messagerie sans backend temps réel).
2. **Aérer et clarifier la navigation** pour concentrer l'utilisateur sur la valeur essentielle : la découverte sportive (**Explorer**) et la pratique (**Courir**).
3. **Coller aux usages locaux à Dakar et au Sénégal** (adoption massive de WhatsApp et Wave).

---

## 📊 Matrice d'Évaluation des Fonctionnalités

| Fonctionnalité | Intérêt Utilisateur | Complexité Technique | Diagnostic | Action Recommandée |
| :--- | :---: | :---: | :--- | :--- |
| **1. Chat In-App par Événement** | 🔴 Très Faible | Élevée | Actuellement mocké en dur, sans infrastructure temps réel. Les coureurs utilisent déjà WhatsApp. | **Supprimer le chat in-app et ajouter un bouton direct WhatsApp** sur la fiche de l'événement. |
| **2. Onglet Carte dédié** | 🟡 Faible / Moyen | Moyenne | Carte souvent clairsemée (peu de points simultanés), redondante avec la carte du Live Tracker. | **Intégrer un toggle « Liste / Carte » dans l'onglet Explorer** (style Airbnb). |
| **3. Onglet Agenda dédié** | 🟡 Moyen | Faible | Utilisé occasionnellement (1-2 fois/semaine) pour consulter ses inscriptions. Prend un slot majeur du menu. | **Fusionner l'Agenda dans l'espace Profil** (section « Mes Inscriptions »). |
| **4. Mode Éco (Paramètres)** | ⚪ Négligeable | Nulle | Simple switch sans aucun effet technique ou batterie mesurable. | **Remplacer par des options utiles pour coureurs** (auto-pause GPS, annonces vocales/sonores). |

---

## 🛠️ Feuille de Route Détaillée (Traitement Pas à Pas)

### 📌 Chantier 1 : Intégration Communauté WhatsApp (Chat in-app masqué & préservé) ✅ TERMINÉ
* **Objectif** :
  Permettre aux organisateurs d'associer un lien de groupe WhatsApp officiel à leur événement et permettre aux coureurs de le rejoindre en 1 clic.
* **Réalisations** :
  1. ✅ Backend NestJS/Prisma : `whatsappGroupUrl` ajouté au schéma Prisma `Event`, pushé sur la base de données Neon, et exposé via `create-event.dto` / `update-event.dto`.
  2. ✅ Frontend Création : Champ `"Groupe WhatsApp (optionnel)"` ajouté dans `CreationScreen.tsx` et branché au store de création.
  3. ✅ Fiche Événement : Carte dédiée "Communauté WhatsApp" + bouton d'action vert WhatsApp dans la barre fixe du bas ouvrant directement WhatsApp avec fallback alerte si aucun lien renseigné.
  4. ✅ Écran Succès : Bouton d'action directe "Rejoindre le WhatsApp" lors d'une inscription confirmée.
  5. ✅ Groupes & Clubs : Champ `whatsappGroupUrl` ajouté au modèle `Club`, formulaire de création [`CreateClubScreen`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/screens/CreateClubScreen.tsx) et carte sur [`ClubDetailScreen`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/screens/ClubDetailScreen.tsx).
  6. 🔒 **Design Messagerie Préservé** : Les composants et écrans de chat (`src/features/chat/*` et `src/app/chat/[id].tsx`) sont intégralement conservés dans le code sans suppression, simplement masqués du flux principal.
* **Bénéfice** : Communication instantanée pour les coureurs dakarois, 0 friction.

---

### 📌 Chantier 2 : Fusion de la Carte dans l'onglet Explorer ✅ TERMINÉ
* **Objectif** :
  Offrir une bascule instantanée Liste / Carte dans Explorer et libérer un onglet dans le menu du bas.
* **Réalisations** :
  1. ✅ Bouton Flottant Élégant (style Airbnb) : Pastille interactive `[ 🗺️ Carte ]` / `[ 📋 Liste ]` ancrée en bas au centre d'[`ExploreScreen`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/events/screens/ExploreScreen.tsx).
  2. ✅ Vue Carte Interactive intégrée : Affichage de `MapLibreView` avec géolocalisation de l'utilisateur, bouton de recentrage GPS et marqueurs dynamiques selon les sports sélectionnés.
  3. ✅ Carte Aperçu d'Événement : Clic sur un marqueur recentre la carte et affiche une carte preview soignée (photo, titre, sport, date, tarif) avec ouverture directe au tap.
  4. ✅ Menu du bas allégé : Retrait de `carte` des onglets actifs dans [`(tabs)/_layout.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/app/(tabs)/_layout.tsx) (conservé en route dormante `href: null`).
* **Bénéfice** : Navigation plus aérée, recherche géographique ultra-intuitive directement dans la découverte.

---

### 📌 Chantier 3 : Intégration de l'Agenda dans l'Espace Profil ✅ TERMINÉ
* **Objectif** :
  Rapatrier l'agenda et les inscriptions dans l'espace personnel Profil et libérer le menu du bas pour atteindre la navigation cible à 3 onglets.
* **Réalisations** :
  1. ✅ Composant Dédié [`ProfileAgendaTab.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/profile/components/profile-agenda-tab.tsx) : Affiche la carte des événements organisés (`ManageEventsCard`), le sélecteur `[ À venir | Passés ]`, et la liste chronologique des inscriptions avec états vides soignés.
  2. ✅ Onglets Profil avec `TabSwitcher` dans [`ProfileScreen.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/profile/screens/ProfileScreen.tsx) : Bascule instantanée entre **[ Mon agenda ]** et **[ Clubs & Réglages ]**, avec support de paramètre d'URL `tab=agenda`.
  3. ✅ Menu Cible Ultime à 3 Onglets dans [`(tabs)/_layout.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/app/(tabs)/_layout.tsx) : Retrait de `agenda` des onglets actifs de la barre du bas.
  4. ✅ Redirection Mise à Jour dans [`SuccessScreen.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/common/screens/SuccessScreen.tsx) vers `/profil?tab=agenda`.
* **Bénéfice** : La barre du bas atteint sa configuration parfaite et épurée : **[ 🧭 Explorer ]  [ ➕ Créer ]  [ 🏃 Courir ]**.

---

### 📌 Chantier 4 : Nettoyage du Mode Éco & Réglages Tracker Utiles ✅ TERMINÉ
* **Objectif** :
  Remplacer le toggle factice « Mode Éco » par de vraies préférences coureur professionnelles persistées et intégrées au moteur GPS.
* **Réalisations** :
  1. ✅ Store Persistant Dédié [`useTrackerSettingsStore.ts`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/tracker/stores/useTrackerSettingsStore.ts) :
     - Stockage avec `AsyncStorage` pour persister `autoPauseEnabled` et `hapticSplitsEnabled`.
  2. ✅ Moteur Live Tracker Intelligent [`useLiveTracker.ts`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/tracker/hooks/useLiveTracker.ts) & [`useTrackerStore.ts`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/tracker/stores/useTrackerStore.ts) :
     - **Auto-pause GPS** : Détecte l'arrêt du coureur (vitesse < 0.6 m/s ou immobilité prolongée > 6s), arrête le chrono et reprend automatiquement (vitesse >= 0.8 m/s) avec micro-vibrations haptiques distinctives.
     - **Alertes kilométriques haptiques** : Déclenche une vibration de succès (`Haptics.notificationAsync`) à chaque passage de kilomètre rond (1 km, 2 km, 3 km...).
  3. ✅ Interface Live Tracker [`LiveTrackerScreen.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/tracker/screens/LiveTrackerScreen.tsx) :
     - Pastille de statut ambre dynamique avec libellé `"Auto-pause"` pendant les arrêts temporaires (feux rouges, étirements), repassant en vert `"En direct"` dès la reprise de course.
  4. ✅ Préférences Profil [`ProfileScreen.tsx`](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/profile/screens/ProfileScreen.tsx) :
     - Retrait complet du faux switch « Mode Éco ».
     - Ajout des deux toggles de préférences coureur : *Auto-pause GPS* et *Alertes kilométriques*.
  5. ✅ Internationalisation :
     - Clés ajoutées dans `fr.json` et `en.json`.
* **Bénéfice** : Une expérience de tracking sportive digne de Strava et Garmin, adaptée et personnalisable.

---

## 📱 Structure Finale Cible du Menu du Bas (Navigation Ultra-Épurée)

Après ces 4 chantiers, la barre de navigation du bas atteint son équilibre ergonomique parfait :

```
┌────────────────────────────────────────────────────────┐
│   [ 🧭 Explorer ]    [ ➕ Créer ]    [ 🏃 Courir ]     │
│       Explore           Create           Track         │
└────────────────────────────────────────────────────────┘
```
*(Avec accès rapide au **Profil**, à ses inscriptions et à ses clubs via l'Avatar toujours présent dans le header en haut).*

---

## 🚦 Suivi de Progression

- [x] **Chantier 1** : Remplacement du Chat in-app par le lien WhatsApp (Chat conservé dans le code)
- [x] **Chantier 2** : Fusion de la Carte dans l'onglet Explorer (Toggle Airbnb Liste / Carte)
- [x] **Chantier 3** : Déplacement de l'Agenda dans le Profil (Bascule Inscriptions / Clubs & Réglages)
- [x] **Chantier 4** : Suppression du Mode Éco & Ajout des réglages Tracker (Auto-pause GPS + Alertes kilométriques)
