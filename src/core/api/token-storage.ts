import { Platform } from 'react-native';

// --- Chargement dynamique des modules de stockage ---

let SecureStore: any = null;
try {
  const mod = require('expo-secure-store');
  if (mod && typeof mod.setItemAsync === 'function') {
    SecureStore = mod;
  }
} catch { }

let AsyncStorage: any = null;
try {
  const mod = require('@react-native-async-storage/async-storage');
  AsyncStorage = mod.default || mod;
  if (AsyncStorage && typeof AsyncStorage.setItem !== 'function') {
    AsyncStorage = null;
  }
} catch { }

// Fallback natif garanti dans Expo Go : expo-file-system
let FileSystem: any = null;
try {
  const mod = require('expo-file-system/legacy');
  if (mod && mod.documentDirectory && typeof mod.writeAsStringAsync === 'function') {
    FileSystem = mod;
  }
} catch { }

console.log('[TokenStorage] Moteurs de stockage initialisés:', {
  platform: Platform.OS,
  secureStore: !!SecureStore,
  asyncStorage: !!AsyncStorage,
  fileSystem: !!FileSystem,
});

const ACCESS_TOKEN_KEY = 'runhub_access_token';
const REFRESH_TOKEN_KEY = 'runhub_refresh_token';

function getFilePath(key: string): string | null {
  if (!FileSystem || !FileSystem.documentDirectory) return null;
  return `${FileSystem.documentDirectory}${key}.txt`;
}

/**
 * Stockage des tokens avec 4 niveaux de fallback :
 *   1. Web             → localStorage
 *   2. Native / EAS    → expo-secure-store (chiffré + persistant)
 *   3. Dev Client      → AsyncStorage
 *   4. Expo Go         → expo-file-system (fichiers permanents dans documentDirectory)
 */
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
      return;
    } catch { }
  }

  if (SecureStore) {
    try {
      await SecureStore.setItemAsync(key, value);
      return;
    } catch {
      SecureStore = null;
    }
  }

  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch {
      AsyncStorage = null;
    }
  }

  if (FileSystem) {
    try {
      const path = getFilePath(key);
      if (path) {
        await FileSystem.writeAsStringAsync(path, value);
        return;
      }
    } catch (e) {
      console.warn('[TokenStorage] FileSystem write failed:', e);
    }
  }

  console.error('[TokenStorage] ⚠️ Aucun moteur de stockage fonctionnel !');
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  if (SecureStore) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      SecureStore = null;
    }
  }

  if (AsyncStorage) {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      AsyncStorage = null;
    }
  }

  if (FileSystem) {
    try {
      const path = getFilePath(key);
      if (path) {
        const info = await FileSystem.getInfoAsync(path);
        if (info && info.exists) {
          return await FileSystem.readAsStringAsync(path);
        }
      }
    } catch (e) {
      console.warn('[TokenStorage] FileSystem read failed:', e);
    }
  }

  return null;
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
      return;
    } catch { }
  }

  if (SecureStore) {
    try {
      await SecureStore.deleteItemAsync(key);
      return;
    } catch {
      SecureStore = null;
    }
  }

  if (AsyncStorage) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      AsyncStorage = null;
    }
  }

  if (FileSystem) {
    try {
      const path = getFilePath(key);
      if (path) {
        await FileSystem.deleteAsync(path, { idempotent: true });
      }
    } catch { }
  }
}

export const TokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getItem(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(token: string): Promise<void> {
    return setItem(ACCESS_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getItem(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    return setItem(REFRESH_TOKEN_KEY, token);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      setItem(ACCESS_TOKEN_KEY, accessToken),
      setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      deleteItem(ACCESS_TOKEN_KEY),
      deleteItem(REFRESH_TOKEN_KEY),
    ]);
  },
};

