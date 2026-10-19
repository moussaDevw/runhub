import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { useHealthData } from '../hooks/useHealthData';

interface HealthConnectModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HealthConnectModal({ visible, onClose }: HealthConnectModalProps) {
  const { provider, isConnecting, connect, disconnect, data } = useHealthData();

  const providerName = provider === 'apple_health' ? 'Apple Santé' : 'Google Santé Connect';
  const isConnected = data?.isConnected;

  const handleToggleConnect = async () => {
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
      onClose();
    } catch {}
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityRole="button">
            <Ionicons name="close" size={22} color={Colors.light.ink3} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Ionicons
              name={provider === 'apple_health' ? 'heart-circle' : 'fitness'}
              size={36}
              color="#e04848"
            />
          </View>

          <Text style={styles.title}>
            {isConnected ? `Connecté à ${providerName}` : `Connecter ${providerName}`}
          </Text>

          <Text style={styles.description}>
            {isConnected
              ? `Vos kilomètres et entraînements sont automatiquement synchronisés avec RunHub.`
              : `Autorisez RunHub à lire vos données de course (distance, pas, fréquence cardiaque) pour suivre automatiquement vos progrès et vos défis.`}
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="speedometer-outline" size={18} color={AccentColors.bissap} />
              <Text style={styles.benefitText}>Calcul automatique de vos km hebdomadaires</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trophy-outline" size={18} color={AccentColors.bissap} />
              <Text style={styles.benefitText}>Progression dans les défis de vos clubs</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="lock-closed-outline" size={18} color={AccentColors.bissap} />
              <Text style={styles.benefitText}>Données privées et sécurisées sur votre appareil</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, isConnected && styles.disconnectBtn]}
            onPress={handleToggleConnect}
            disabled={isConnecting}
            activeOpacity={0.8}
          >
            {isConnecting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.actionBtnText}>
                {isConnected ? 'Déconnecter la synchronisation' : `Autoriser ${providerName}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.space20,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    padding: Spacing.space24,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee4e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space16,
    marginTop: Spacing.space8,
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 19,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.space8,
  },
  description: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.space16,
  },
  benefitsList: {
    width: '100%',
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 14,
    padding: Spacing.space12,
    marginBottom: Spacing.space20,
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.text,
    flex: 1,
  },
  actionBtn: {
    width: '100%',
    backgroundColor: Colors.light.text,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectBtn: {
    backgroundColor: '#dc2626',
  },
  actionBtnText: {
    color: '#ffffff',
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
  },
});
