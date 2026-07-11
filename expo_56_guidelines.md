# Règles et Bonnes Pratiques pour Expo SDK 56 et `@expo/ui`

Ce document résume les changements majeurs introduits par **Expo SDK 56** et la bibliothèque **`@expo/ui`**, ainsi que les règles que nous devons respecter pour le développement de ce projet (`runhub`).

> [!IMPORTANT]
> **Expo SDK 56** (sorti en mai 2026) marque un tournant majeur avec la stabilisation de `@expo/ui`. Cette bibliothèque permet d'utiliser de véritables composants natifs (SwiftUI sur iOS et Jetpack Compose sur Android) au lieu de réimplémentations JavaScript, offrant des performances et un ressenti 100% natifs.

---

## 1. Utilisation de `@expo/ui` (Composants Universels)

La principale nouveauté est l'API de composants universels. Nous devons privilégier l'utilisation de ces composants natifs par rapport à ceux de `react-native` standard lorsque cela est possible.

### Règles à respecter :
*   **Priorité aux composants `@expo/ui`** : Pour la structure et les éléments de base, utilisez les imports depuis `@expo/ui`.
    *   *Exemples* : `Host`, `Row`, `Column`, `ScrollView`, `Text`, `TextInput`, `Button`, `Switch`, `Slider`, `Checkbox`, `BottomSheet`.
*   **Composants de layout** : Utilisez `Row` et `Column` pour construire vos interfaces au lieu d'utiliser systématiquement des `View` avec du `flexDirection`. Cela se traduit directement par des `HStack`/`VStack` en SwiftUI ou `Row`/`Column` en Compose.
*   **Propriétés natives (1-to-1)** : Les noms des modificateurs et propriétés correspondent exactement à la documentation officielle d'Apple (SwiftUI) et de Google (Jetpack Compose). Vous pouvez vous référer à la documentation native si besoin.
*   **Un seul fichier `*.tsx`** : Grâce à ces composants universels, il n'est plus nécessaire de séparer les fichiers en `.ios.tsx` et `.android.tsx`. Une seule base de code gère le rendu natif sous le capot.

---

## 2. Remplacements et Dépendances (Drop-in replacements)

Avec SDK 56, Expo a commencé à intégrer des alternatives natives directes à certaines bibliothèques communautaires lourdes.

### Règles à respecter :
*   **`@expo/ui/community`** : Vérifiez s'il existe un "drop-in replacement" dans `@expo/ui/community` avant d'installer une nouvelle bibliothèque externe pour un composant UI. Cela permet de réduire la taille du bundle et d'augmenter la stabilité.
*   **Icônes natives avec `expo-symbols`** : Le projet utilise déjà `expo-symbols`. Il faut continuer à l'utiliser (comme vu dans `Collapsible`) car il tire parti des *SF Symbols* sur iOS et des icônes système sur Android/Web, ce qui est beaucoup plus léger et performant que les polices d'icônes traditionnelles (`@expo/vector-icons`).

---

## 3. Architecture et React Native 0.85

Le SDK 56 s'appuie sur **React Native 0.85**. 

> [!NOTE]
> La **Nouvelle Architecture** (New Architecture) est désormais la norme, incluant le *Bridgeless mode*, *Fabric* (le nouveau moteur de rendu) et les *TurboModules*.

### Règles à respecter :
*   **Compatibilité des modules externes** : Lors de l'ajout d'un package npm ou d'une bibliothèque tierce, assurez-vous qu'elle supporte la Nouvelle Architecture (Fabric/TurboModules). Les vieux modules dépendants du "Bridge" peuvent causer des baisses de performances ou ne plus fonctionner correctement.
*   **Worklets et Animations** : Le projet utilise `react-native-worklets` (v0.8.3) et `react-native-reanimated` (v4.3.1). Utilisez toujours l'API Reanimated ou les worklets pour vos animations complexes afin qu'elles s'exécutent sur le thread UI et ne bloquent pas le thread JavaScript.
*   **Effets visuels natifs** : Le package `expo-glass-effect` est présent. Utilisez-le pour les effets de flou (blur/glassmorphism) car il est optimisé pour les deux plateformes de manière native.

---

## 4. Organisation des composants UI

Actuellement, le projet utilise des dossiers comme `src/components/ui/` et des composants stylisés via un système de thème interne (e.g. `ThemedText`, `ThemedView`).

### Règles à respecter :
*   **Mise à jour progressive** : Pour l'instant, `ThemedView` et `ThemedText` enveloppent probablement des composants `react-native` standards. Lors de refontes ou de la création de nouvelles interfaces, évaluez s'il est pertinent de les remplacer ou de les faire s'appuyer sur `@expo/ui` (`Column`/`Row`/`Text`).
*   **Expo Router** : Le projet utilise la dernière version (`~56.2.8`). Continuez à structurer vos écrans dans le dossier `app/` en respectant les conventions de nommage basées sur les fichiers (file-based routing).

---

## Résumé du workflow de développement UI

1. Vous avez besoin d'un bouton, d'une rangée ou d'une liste ? **Vérifiez `@expo/ui` en premier**.
2. Vous avez besoin d'une icône ? **Utilisez `expo-symbols`**.
3. Vous devez ajouter une librairie externe ? **Vérifiez sa compatibilité avec la Nouvelle Architecture (React Native 0.85) ou cherchez dans `@expo/ui/community`**.
4. Vous ajoutez une animation ? **Restez sur le UI thread avec `react-native-reanimated`**.
