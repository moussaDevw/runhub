# 🏃 Diagnostic du Projet RunHub
> Généré le 21 juillet 2026

---

## 1. Vue d'ensemble

**RunHub** est une application mobile multiplateforme (iOS, Android, Web) dédiée à la **découverte et la gestion d'événements sportifs**, pensée principalement pour le marché **sénégalais/africain** (identité visuelle inspirée de la culture locale, backend à `api.runhub.sn`).

| Propriété | Valeur |
|---|---|
| Nom | runhub |
| Version | 1.0.0 |
| Bundle ID iOS | com.musadiagnesorganization.runhub |
| Package Android | com.musadiagnesorganization.runhub |
| EAS Project ID | e9bb3818-4b7f-4eb0-80bb-0d2620be1551 |
| Owner EAS | musadiagnes-organization |
| SDK Expo | ~56.0.13 |
| React Native | 0.85.3 |
| React | 19.2.3 |
| TypeScript | ~6.0.3 |

---

## 2. Stack Technique

### Framework & Runtime
- **Expo SDK 56** (dernière version stable) — configuration `app.json`
- **Expo Router v56.2.12** — routing basé sur les fichiers (`src/app/`)
- **React 19.2** & **React Native 0.85.3**
- **TypeScript 6.0** avec `typedRoutes` activé et `reactCompiler` expérimental activé
- **NativeTabs** (`expo-router/unstable-native-tabs`) pour la barre de navigation

### State Management
- **TanStack React Query v5** — data fetching & cache serveur
- **Zustand v5** — état local côté client (utilisé pour la création d'événements)
- **React Context** — Auth (`AuthContext`) + Favoris (`FavoritesContext`)

### UI & Design
- **Design system custom** basé sur un thème Afro-sénégalais :
  - Couleur principale : **Bissap** (`#b8324f`) — rouge hibiscus
  - Palette de fonds : Crème, Ivoire, Sable, Brume (light), Nuit (dark)
  - Typographies : **Space Grotesk** (titres), **Hanken Grotesk** (corps), **Geist Mono** (méta)
  - `dark mode` supporté via `useColorScheme`
- **expo-image** (optimisation des images)
- **expo-linear-gradient** & **expo-glass-effect** (effets visuels)
- **@maplibre/maplibre-react-native** + **react-native-maps** (carte interactive)

### Internationalisation
- **i18next** + **react-i18next** — support FR 🇫🇷 et EN 🇬🇧
- Fichiers de traductions : `src/core/i18n/locales/fr.json` & `en.json`

### Authentification
- **OAuth** via Google & Apple (`expo-auth-session`, `expo-apple-authentication`)
- Tokens JWT stockés avec un système de **fallback à 4 niveaux** :
  1. Web → `localStorage`
  2. EAS Build → `expo-secure-store` (chiffré)
  3. Dev Client → `AsyncStorage`
  4. Expo Go → `expo-file-system`

---

## 3. Architecture du projet

```
runhub/
├── src/
│   ├── app/                    # Routes Expo Router (file-based routing)
│   │   ├── _layout.tsx         # Root layout (Providers: QueryClient, Auth, Favorites, Theme)
│   │   ├── index.tsx           # Redirect auth → /(tabs)/explorer, sinon WelcomeScreen
│   │   ├── (tabs)/             # Barre de navigation principale (5 onglets)
│   │   │   ├── explorer.tsx    # Onglet Explorer
│   │   │   ├── carte.tsx       # Onglet Carte
│   │   │   ├── creer.tsx       # Onglet Créer
│   │   │   ├── agenda.tsx      # Onglet Agenda
│   │   │   └── profil.tsx      # Onglet Profil
│   │   ├── auth/               # Routes d'authentification
│   │   ├── event/              # Routes détail événement
│   │   ├── club/               # Routes détail club
│   │   ├── ticket/             # Routes ticket
│   │   ├── check-in/           # Routes check-in QR
│   │   ├── chat/               # Routes chat
│   │   └── ...                 # Autres routes (profil, favoris, etc.)
│   ├── features/               # Modules fonctionnels (Feature-Sliced Design)
│   │   ├── auth/               # Authentification (OAuth Google/Apple)
│   │   ├── events/             # Événements (explore, détail, création)
│   │   ├── creation/           # Workflow de création d'événement
│   │   ├── profile/            # Profil utilisateur
│   │   ├── clubs/              # Clubs sportifs
│   │   ├── agenda/             # Mes inscriptions
│   │   ├── tickets/            # Billets
│   │   ├── check-in/           # Scanner QR code
│   │   ├── map/                # Vue carte
│   │   ├── chat/               # Messagerie
│   │   ├── notifications/      # Notifications
│   │   ├── sports/             # Catalogue sports
│   │   ├── upload/             # Upload de médias
│   │   └── common/             # Composants partagés inter-features
│   ├── components/             # Composants UI réutilisables (35+ composants)
│   │   └── ui/                 # Composants UI (EventCard, Avatar, Chip, etc.)
│   ├── core/                   # Couche infrastructure
│   │   ├── api/                # Client HTTP, token storage, query client
│   │   └── i18n/               # Configuration i18next + locales
│   ├── constants/              # Design tokens (theme.ts)
│   ├── context/                # Contextes React globaux
│   └── hooks/                  # Hooks globaux partagés
├── assets/                     # Images, icônes, splash
├── app.json                    # Config Expo
├── package.json                # Dépendances
├── tsconfig.json               # Config TypeScript
└── eas.json                    # Config EAS Build
```

---

## 4. Fonctionnalités identifiées

### ✅ Implémentées

| Fonctionnalité | Détail |
|---|---|
| **Authentification OAuth** | Google + Apple, flow complet avec token JWT |
| **Welcome / Onboarding** | WelcomeScreen, OnboardingScreen, LoginScreen |
| **Explorer d'événements** | ExploreScreen avec filtre par sport, recherche, pagination |
| **Détail événement** | EventDetailScreen avec inscription/désinscription |
| **Aperçu événement** | EventPreviewScreen (avant publication) |
| **Création d'événement** | CreationScreen multi-étape, upload cover, Zustand store |
| **Gestion des événements** | ManageEventsScreen (mes événements, statuts draft/published) |
| **Carte interactive** | MapLibre avec markers, chip sport |
| **Agenda personnel** | Mes inscriptions à venir |
| **Tickets** | TicketDetailScreen avec QR code |
| **Check-in QR** | QrScannerScreen + CheckInListScreen pour organisateurs |
| **Profil utilisateur** | ProfileScreen, EditProfileScreen |
| **Favoris** | FavoritesScreen + FavoritesContext |
| **Clubs** | ClubDetailScreen |
| **Notifications** | NotificationItem UI |
| **Chat** | Screens en place |
| **Sports** | Catalogue avec filtre SportsScreen |
| **Dark mode** | Support complet via `useColorScheme` |
| **i18n FR/EN** | i18next configuré, locales complètes |
| **Upload médias** | expo-image-picker, API upload |

---

## 5. Architecture API

### Client HTTP (`src/core/api/client.ts`)
- **Centralisation** : toutes les requêtes passent par `apiClient()`
- **Auto-détection URL** en dev (Expo Go sur téléphone réel → IP locale automatique)
- **URL de production** : `https://api.runhub.sn/api`
- **Injection automatique** du JWT Bearer token
- **Gestion d'erreurs** typée via `ApiError` (status + body)
- **Unwrap NestJS** : `{ success: true, data: T }` transparent pour les appelants
- **Support FormData** (pour l'upload de fichiers)

### Modules API disponibles
| Module | Endpoints couverts |
|---|---|
| `auth.api.ts` | `verifyOAuth`, `getMe`, `logout` |
| `events.api.ts` | CRUD événements, publish, register/cancel, participants, mes inscriptions |
| `favorites.api.ts` | Gestion des favoris |
| `sports.api.ts` | Liste des sports |
| `location.api.ts` | Géolocalisation |
| Upload API | Upload de média (couverture événement) |

### Backend attendu
- **Framework** : NestJS (déduit du wrapping `ApiResponse`)
- **Auth** : OAuth Google + Apple → JWT
- **Entités principales** : User, Event, Sport, Club, Registration, Ticket, Notification, Chat

---

## 6. Points forts 💪

1. **Architecture Feature-Sliced** cohérente — chaque feature est autonome (api / hooks / screens / types)
2. **Design system fort** — tokens de couleur, typographie et spacing centralisés dans `theme.ts`, identité visuelle originale et distincte (inspirée Sénégal/Afrique)
3. **Client API robuste** — fallback multi-environnement, gestion d'erreurs typée, token injection automatique
4. **TokenStorage résilient** — 4 niveaux de fallback pour couvrir tous les environnements Expo
5. **Expo SDK 56 à jour** — React 19.2, React Native 0.85, NativeTabs, reactCompiler
6. **UX complète** — du welcome au check-in, tous les grands cas d'usage sont couverts
7. **Multi-plateforme** — iOS, Android et Web (export static)
8. **Internationalisation** — FR + EN dès le départ

---

## 7. Points d'attention & recommandations ⚠️

### 🔴 Critiques

| # | Problème | Détail | Recommandation |
|---|---|---|---|
| C1 | **Pas de refresh token** | `TokenStorage` stocke un `refreshToken` mais il n'est jamais utilisé pour renouveler le `accessToken` expiré. L'utilisateur est simplement déconnecté. | Implémenter un intercepteur de renouvellement automatique dans `apiClient` (401 → refresh → retry) |
| C2 | **`console.log` en production** | `token-storage.ts` ligne 31 logge les moteurs de stockage à chaque démarrage | Supprimer ou conditionner à `__DEV__` |
| C3 | **Pas de gestion de token expiré côté AuthContext** | Si le token expire en cours de session, les requêtes échouent silencieusement ; `logout` n'est pas appelé automatiquement | Écouter les `ApiError` 401 dans `apiClient` et appeler `logout()` ou le refresh |

### 🟡 Importants

| # | Problème | Détail | Recommandation |
|---|---|---|---|
| I1 | **`NativeTabs` unstable** | `expo-router/unstable-native-tabs` est utilisé en production. Cette API est marquée unstable. | Surveiller les releases Expo et migrer quand l'API est stable |
| I2 | **Pas de tests** | Aucun fichier de test (`.test.ts`, `.spec.ts`) détecté dans le projet | Ajouter des tests unitaires (hooks) et des tests d'intégration (API mocks) |
| I3 | **`reactCompiler` expérimental** | Activé dans `app.json` — peut introduire des bugs subtils avec des librairies tierces | Tester minutieusement avant mise en production |
| I4 | **`FavoritesContext` redondant** | La gestion des favoris est à la fois dans `FavoritesContext` et dans `useFavorites.ts` (React Query) | Unifier — préférer React Query + invalidation de cache |
| I5 | **Double librairie de cartes** | `@maplibre/maplibre-react-native` ET `react-native-maps` sont tous deux dans les dépendances | Choisir l'une ou l'autre pour éviter le gonflement du bundle |
| I6 | **Pas d'ESLint/Prettier configuré** | Le README mentionne `expo lint` mais aucun fichier `.eslintrc` n'est présent | Configurer ESLint + Prettier pour la cohérence du code |
| I7 | **`Colors.light.ink3` non typé** | Dans les tabs layout, `Colors.light.ink3` est utilisé hors type `ThemeColor` | Ajouter `ink3` à l'interface `ThemeColor` |

### 🟢 Améliorations suggérées

| # | Suggestion | Détail |
|---|---|---|
| S1 | **Pagination infinie** | `ExploreScreen` utilise une pagination classique. Envisager `useInfiniteQuery` pour un scroll infini plus fluide |
| S2 | **Error Boundary global** | Aucun Error Boundary React détecté. En cas de crash d'un composant, l'app s'arrête entièrement |
| S3 | **Skeleton loading** | Remplacer les `ActivityIndicator` par des skeleton screens pour une meilleure expérience de chargement |
| S4 | **README à mettre à jour** | Le README est le template par défaut Expo. Il devrait documenter le projet RunHub spécifiquement |
| S5 | **Variables d'environnement typées** | Créer un fichier `env.d.ts` pour typer `process.env.EXPO_PUBLIC_*` |
| S6 | **Push Notifications** | `expo-device` est installé mais aucune configuration push visible. À implémenter pour les rappels d'événements |

---

## 8. Dépendances inhabituelles / risques

| Package | Risque | Note |
|---|---|---|
| `react-native-worklets` | Peer de Reanimated 4 — API encore jeune | Surveiller la compatibilité avec les mises à jour |
| `expo-glass-effect` | Module Expo UI — production ready en SDK 56 | OK |
| `@maplibre/maplibre-react-native` | Natif — alourdit le build | Plugin Expo configuré, OK |
| `i18next@^26.3.6` | Version majeure récente | Vérifier la compatibilité `react-i18next` |

---

## 9. Résumé des fichiers clés

| Fichier | Rôle |
|---|---|
| [src/app/_layout.tsx](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/app/_layout.tsx) | Providers globaux (QueryClient, Auth, Favorites, Theme) |
| [src/app/index.tsx](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/app/index.tsx) | Guard d'authentification + redirection |
| [src/core/api/client.ts](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/core/api/client.ts) | Client HTTP centralisé |
| [src/core/api/token-storage.ts](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/core/api/token-storage.ts) | Stockage sécurisé des tokens JWT |
| [src/features/auth/context/AuthContext.tsx](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/auth/context/AuthContext.tsx) | Session utilisateur globale |
| [src/constants/theme.ts](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/constants/theme.ts) | Design system (couleurs, typo, spacing) |
| [src/features/events/api/events.api.ts](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/features/events/api/events.api.ts) | API events complète (CRUD + inscriptions) |
| [src/app/(tabs)/_layout.tsx](file:///c:/Users/musad/OneDrive/Bureau/projet-perso/runhub/src/app/%28tabs%29/_layout.tsx) | Navigation principale (5 onglets NativeTabs) |

---

## 10. Conclusion

RunHub est un **projet bien structuré et ambitieux**, avec une architecture solide (Feature-Sliced Design), un design system original et un stack technique moderne et à jour (Expo 56, React 19, RN 0.85). La couverture fonctionnelle est impressionnante pour un projet personnel.

Les **points critiques à adresser en priorité** sont l'implémentation du rafraîchissement automatique des tokens JWT (C1) et la suppression du log en production (C2). Ensuite, la mise en place de tests (I2) et l'unification de la gestion des favoris (I4) renforcerait la maintenabilité sur le long terme.

> **Score global estimé : 8/10** — Projet mature, bien pensé, quelques ajustements de robustesse à faire avant une mise en production sérieuse.
