# Expo 56 Guide & Changes

When developing with Expo in this project, remember that we are targeting **Expo SDK 56**. Here are the critical changes and new features you MUST be aware of:

## 1. Expo UI (Stable)
- The Jetpack Compose (Android) and SwiftUI (iOS) APIs are now production-ready and included in the default `create-expo-app` template.
- You can build native UI directly with these modern declarative frameworks.

## 2. Core Library Upgrades
- **React Native 0.85** is the new base.
- **React 19.2** is used.

## 3. Native Modules & Inline Modules
- You can now write Swift and Kotlin modules directly next to your app files (Inline Modules).
- Automatic TypeScript interface generation is provided.

## 4. Expo Router Updates
- **Decoupled from React Navigation:** Expo Router is no longer tied to React Navigation, which changes how navigation state is handled under the hood.

## 5. Other Notable Features
- **Stable APIs:** Calendar, Contacts, and MediaLibrary are now stable.
- **iOS Widgets:** Now stable and ready for production.
- **Performance:** Faster native builds and Hermes bytecode diffing is enabled by default.

Always refer to the exact versioned docs at [https://docs.expo.dev/versions/v56.0.0/](https://docs.expo.dev/versions/v56.0.0/) for full API details.
