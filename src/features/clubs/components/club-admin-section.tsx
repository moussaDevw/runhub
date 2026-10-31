import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';

interface ClubAdminSectionProps {
  pendingCount: number;
  membersCount: number;
  onPressRequests: () => void;
  onPressCreateEvent: () => void;
  onPressMembers: () => void;
}

export function ClubAdminSection({
  pendingCount,
  membersCount,
  onPressRequests,
  onPressCreateEvent,
  onPressMembers,
}: ClubAdminSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Ionicons name="settings-outline" size={16} color={Colors.light.ink3} />
        <Text style={styles.adminSectionTitle}>{t('club.management')}</Text>
      </View>

      <View style={styles.adminCardsContainer}>
        {/* 1. Demandes d'adhésion */}
        <TouchableOpacity
          style={styles.adminCard}
          activeOpacity={0.8}
          onPress={onPressRequests}
        >
          <View style={styles.adminCardLeft}>
            <View style={styles.adminIconBox}>
              <Ionicons name="people-outline" size={20} color={AccentColors.bissap} />
            </View>
            <View>
              <Text style={styles.adminCardTitle}>{t('club.joinRequests')}</Text>
              <Text style={styles.adminCardSub}>
                {pendingCount > 0
                  ? t('club.pendingRequestsCount', { count: pendingCount })
                  : t('club.noPendingRequests')}
              </Text>
            </View>
          </View>
          <View style={styles.adminCardRight}>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
          </View>
        </TouchableOpacity>

        {/* 2. Créer un événement */}
        <TouchableOpacity
          style={[styles.adminCard, { marginTop: Spacing.space12 }]}
          activeOpacity={0.8}
          onPress={onPressCreateEvent}
        >
          <View style={styles.adminCardLeft}>
            <View style={[styles.adminIconBox, { backgroundColor: '#f0f1f8' }]}>
              <Ionicons name="calendar-outline" size={20} color={AccentColors.indigoWolof} />
            </View>
            <View>
              <Text style={styles.adminCardTitle}>{t('club.createEvent')}</Text>
              <Text style={styles.adminCardSub}>{t('club.createEventSub')}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
        </TouchableOpacity>

        {/* 3. Membres du club */}
        <TouchableOpacity
          style={[styles.adminCard, { marginTop: Spacing.space12 }]}
          activeOpacity={0.8}
          onPress={onPressMembers}
        >
          <View style={styles.adminCardLeft}>
            <View style={[styles.adminIconBox, { backgroundColor: '#fdf2f8' }]}>
              <Ionicons name="person-circle-outline" size={20} color={AccentColors.bissap} />
            </View>
            <View>
              <Text style={styles.adminCardTitle}>{t('club.manageMembers')}</Text>
              <Text style={styles.adminCardSub}>
                {t('club.membersCount', { count: membersCount })}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adminSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.space16,
    marginBottom: Spacing.space24,
    borderWidth: 1,
    borderColor: '#e8e5e0',
  },
  adminSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space12,
  },
  adminSectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  adminCardsContainer: {
    gap: 0,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BackgroundThemes.Ivoire,
    paddingHorizontal: Spacing.space12,
    paddingVertical: Spacing.space12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ebe7e1',
  },
  adminCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fde8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  adminCardTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  adminCardSub: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 1,
  },
  adminCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: AccentColors.bissap,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 6,
  },
  badgeText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: '#ffffff',
  },
});
