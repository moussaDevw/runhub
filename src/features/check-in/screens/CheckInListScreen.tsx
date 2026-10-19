import { Ionicons } from '@expo/vector-icons';
import { Stack as RouterStack } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { HStack, Screen, VStack } from '@/components/layout';
import { CheckInProgress, ParticipantRow, ParticipantRowSkeleton } from '@/features/check-in/components';
import { AccentColors, Colors, Radius, Shadows, Spacing, Typography, NeutralColors } from '@/constants/theme';
import { formatPrice } from '@/core/utils/locale';
import {
  getAvatarColor,
  getUserDisplayName,
  getUserInitials,
  useCheckInListScreen,
} from '../hooks/useCheckInListScreen';

export function CheckInListScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    event,
    presentation,
    participants,
    filteredParticipants,
    totalCount,
    arrivedCount,
    pendingCount,
    isRefreshing,
    isParticipantsLoading,
    searchQuery,
    setSearchQuery,
    handleClearSearch,
    filterMode,
    setFilterMode,
    mutatingRegistrationId,
    handleToggle,
    handleRefresh,
    handleBack,
    handleGoToEdit,
    handleGoToScan,
  } = useCheckInListScreen();

  return (
    <Screen safeTop safeBottom={false} style={styles.container}>
      <RouterStack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <HStack align="center" justify="space-between" style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <VStack style={styles.headerTitles}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {event?.title || t('checkIn.loading')}
          </Text>
          {presentation && (
            <Text style={styles.headerSubtitle}>
              {t('checkIn.subtitle', { day: presentation.dateDay, time: presentation.dateTime })}
            </Text>
          )}
        </VStack>

        <TouchableOpacity style={styles.editButton} onPress={handleGoToEdit}>
          <Ionicons name="create-outline" size={18} color={AccentColors.bissap} style={{ marginRight: 4 }} />
          <Text style={styles.editText}>{t('checkIn.edit')}</Text>
        </TouchableOpacity>
      </HStack>

      {/* PROGRESS SECTION */}
      <CheckInProgress current={arrivedCount} total={totalCount} />

      {/* SEARCH AND FILTERS */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.light.ink3} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('checkIn.searchPlaceholder')}
            placeholderTextColor={Colors.light.ink3}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={18} color={Colors.light.ink3} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPills}>
          <TouchableOpacity
            style={[styles.pill, filterMode === 'all' && styles.pillActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.pillText, filterMode === 'all' && styles.pillTextActive]}>
              {t('checkIn.all', { count: totalCount })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filterMode === 'arrived' && styles.pillActive]}
            onPress={() => setFilterMode('arrived')}
          >
            <Text style={[styles.pillText, filterMode === 'arrived' && styles.pillTextActive]}>
              {t('checkIn.arrived', { count: arrivedCount })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filterMode === 'pending' && styles.pillActive]}
            onPress={() => setFilterMode('pending')}
          >
            <Text style={[styles.pillText, filterMode === 'pending' && styles.pillTextActive]}>
              {t('checkIn.pending', { count: pendingCount })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PARTICIPANTS LIST */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={AccentColors.bissap}
          />
        }
      >
        <Text style={styles.sectionTitle}>
          {t('checkIn.participants', { count: filteredParticipants.length })}
        </Text>

        {isParticipantsLoading && participants.length === 0 ? (
          <View>
            <ParticipantRowSkeleton />
            <ParticipantRowSkeleton />
            <ParticipantRowSkeleton />
            <ParticipantRowSkeleton />
            <ParticipantRowSkeleton />
            <ParticipantRowSkeleton />
          </View>
        ) : filteredParticipants.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.light.ink3} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? t('checkIn.noParticipantsFound') : t('checkIn.noParticipantsRegistered')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? t('checkIn.searchHint')
                : t('checkIn.emptyHint')}
            </Text>
          </View>
        ) : (
          filteredParticipants.map((p) => {
            const name = getUserDisplayName(p.user?.firstName, p.user?.lastName, p.user?.username);
            const initials = getUserInitials(p.user?.firstName, p.user?.lastName, p.user?.username);
            const color = getAvatarColor(p.user?.id || p.id);
            const isArrived = p.status === 'checked_in';

            // Payment display
            let paymentText = t('event.free');
            if (event && event.price > 0) {
              paymentText = p.status === 'pending' ? t('eventDetail.paymentPending', { defaultValue: 'Paiement en attente' }) : `Payé · ${formatPrice(event.price)}`;
            }

            return (
              <ParticipantRow
                key={p.id}
                name={name}
                initials={initials}
                avatarColor={color}
                paymentStatus={paymentText}
                isArrived={isArrived}
                isLoading={mutatingRegistrationId === p.id}
                onCheckInToggle={() => handleToggle(p.id)}
              />
            );
          })
        )}
      </ScrollView>

      {/* FLOATING BUTTON */}
      <View style={[styles.floatingButtonContainer, { paddingBottom: Math.max(insets.bottom, Spacing.space24) }]}>
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.8}
          onPress={handleGoToScan}
        >
          <Ionicons name="scan-outline" size={20} color={NeutralColors.white} style={{ marginRight: Spacing.space8 }} />
          <Text style={styles.floatingButtonText}>{t('checkIn.scanTickets')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
    marginRight: Spacing.space8,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AccentColors.bissap,
    borderRadius: Radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: AccentColors.bissap,
  },
  searchSection: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space8,
    paddingBottom: Spacing.space8,
    backgroundColor: Colors.light.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.space12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: Spacing.space12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  filterPills: {
    flexDirection: 'row',
    gap: Spacing.space8,
  },
  pill: {
    paddingHorizontal: Spacing.space12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
  },
  pillActive: {
    backgroundColor: Colors.light.text,
  },
  pillText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  pillTextActive: {
    color: NeutralColors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
  },
  sectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: Spacing.space20,
  },
  emptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NeutralColors.transparent,
    paddingHorizontal: Spacing.space20,
  },
  floatingButton: {
    backgroundColor: AccentColors.bissap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Radius.btn,
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: NeutralColors.white,
  },
});
