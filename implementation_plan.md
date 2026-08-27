# Ajouter la section "Mes Clubs" au Profil

Ce plan détaille comment nous allons ajouter la liste des clubs auxquels l'utilisateur appartient (ou qu'il a créés) dans l'écran Profil, avec un bouton pour en créer un nouveau.

## User Review Required

> [!IMPORTANT]  
> Le backend sera modifié pour exposer une nouvelle route `GET /users/me/clubs`. Assurez-vous que l'application backend est en cours d'exécution et pourra être rechargée après ces modifications.

## Open Questions

Aucune question bloquante pour l'instant. Les clubs créés et les clubs rejoints utilisent la même table `clubMember` (avec le rôle `OWNER` pour ceux créés), donc ils seront tous listés ensemble sous "Mes Clubs".

## Proposed Changes

### Backend (Jump-In API)

#### [MODIFY] `users.service.ts` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/jump-in/src/users/users.service.ts)
- Ajouter une méthode `getMyClubs(userId: string)` qui utilise Prisma pour interroger la table `clubMember` et retourner la liste des clubs (`club`) associés à cet utilisateur.

#### [MODIFY] `users.controller.ts` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/jump-in/src/users/users.controller.ts)
- Ajouter une route `@Get('me/clubs')` qui appelle `this.usersService.getMyClubs(userId)`.

---

### Frontend (RunHub App)

#### [MODIFY] `clubs.api.ts` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/api/clubs.api.ts)
- Ajouter une fonction `getMyClubs(): Promise<ClubResponse[]>` qui appelle `GET /users/me/clubs`.

#### [NEW] `useMyClubs.ts` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/hooks/useMyClubs.ts)
- Créer un hook React Query pour récupérer les clubs de l'utilisateur de manière asynchrone et gérer l'état de chargement.

#### [MODIFY] `ProfileScreen.tsx` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/profile/screens/ProfileScreen.tsx)
- Ajouter une section **"Mes Clubs"** en dessous de "Mes Sports".
- Si l'utilisateur a des clubs, les afficher sous forme de liste horizontale (ou de petites cartes) avec le logo/nom du club.
- Ajouter un bouton **"Créer un club"** dans l'en-tête de cette section ou un grand bouton incitatif s'il n'en a aucun, qui redirige vers `/club/create`.

## Verification Plan

### Automated Tests
- Le backend sera recompilé automatiquement par NestJS (`npm run start:dev`).

### Manual Verification
- Naviguer vers l'écran **Profil** dans l'application mobile.
- Vérifier que la section "Mes Clubs" s'affiche correctement (vide si l'utilisateur n'en a pas).
- Cliquer sur "Créer un club", être redirigé vers le formulaire, et finaliser la création.
- Revenir sur le Profil et constater que le nouveau club créé est bien listé.

---

# Intégration de l'écran de détail du Club (ClubDetailScreen)

Suite à la création du club, l'utilisateur est redirigé vers l'écran de détail du club. Actuellement, cet écran contient des données statiques (mockées). Nous devons l'intégrer avec les vraies données du backend pour finaliser le flux de création.

## User Review Required

> [!IMPORTANT]  
> Le backend a déjà l'endpoint `GET /clubs/:id`. Nous allons créer un hook `useClubDetails` pour récupérer ces données et remplacer les données statiques dans `ClubDetailScreen.tsx`.

## Proposed Changes

### Frontend (RunHub App)

#### [NEW] `useClubDetails.ts` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/hooks/useClubDetails.ts)
- Créer un hook React Query pour appeler `ClubsApi.getClub(id)`.

#### [MODIFY] `ClubDetailScreen.tsx` (file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/clubs/screens/ClubDetailScreen.tsx)
- Récupérer l'ID du club via `useLocalSearchParams()`.
- Utiliser le hook `useClubDetails` pour charger les données du club.
- Afficher le nom, la description (bio), le logo, la couverture et les statistiques (`_count.members`, `_count.events`) réels du club.
- Gérer l'état de chargement et d'erreur.

## Verification Plan

### Manual Verification
- Créer un nouveau club depuis le Profil.
- Vérifier la redirection automatique vers la page de détail du club.
- S'assurer que le nom, la description et les images affichées correspondent bien à ceux saisis lors de la création.
