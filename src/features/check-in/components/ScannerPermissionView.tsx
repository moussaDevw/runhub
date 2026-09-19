import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccentColors, Spacing, Typography } from '@/constants/theme';

export interface ScannerPermissionViewProps {
  canAskAgain?: boolean;
  onRequestPermission: () => void;
  onOpenManualEntry: () => void;
  onBack: () => void;
  insetsTop?: number;
}

export function ScannerPermissionView({
  canAskAgain = true,
  onRequestPermission,
  onOpenManualEntry,
  onBack,
  insetsTop = 0,
}: ScannerPermissionViewProps) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insetsTop, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scanner les billets</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* PERMISSION CARD */}
      <View style={styles.permissionContent}>
        <View style={styles.permissionIconCircle}>
          <Ionicons name="camera-outline" size={48} color={AccentColors.bissap} />
        </View>

        <Text style={styles.permissionTitle}>Autorisation caméra requise</Text>
        <Text style={styles.permissionDescription}>
          RunHub a besoin d&apos;accéder à votre caméra pour scanner les QR codes des participants à l&apos;arrivée.
        </Text>

        <TouchableOpacity
          style={styles.permissionPrimaryButton}
          activeOpacity={0.8}
          onPress={onRequestPermission}
        >
          <Ionicons name="camera" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.permissionPrimaryButtonText}>
            {!canAskAgain ? 'Ouvrir les réglages' : 'Autoriser la caméra'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.permissionSecondaryButton}
          activeOpacity={0.8}
          onPress={onOpenManualEntry}
        >
          <Ionicons name="keypad-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.permissionSecondaryButtonText}>Saisir le code manuellement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151318',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: '#ffffff',
  },
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.space32,
    marginTop: -40,
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(184, 50, 79, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space24,
  },
  permissionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 22,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: Spacing.space12,
  },
  permissionDescription: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.space32,
  },
  permissionPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AccentColors.bissap,
    width: '100%',
    height: 52,
    borderRadius: 16,
    marginBottom: Spacing.space16,
  },
  permissionPrimaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  permissionSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    height: 48,
    borderRadius: 16,
  },
  permissionSecondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
});
