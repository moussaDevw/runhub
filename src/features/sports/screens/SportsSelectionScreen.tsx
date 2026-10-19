import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { SportCard, SportCardSkeleton } from '@/features/sports/components';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAllSports, useUpdateUserSports } from '@/features/sports/hooks/useSports';

export function SportsSelectionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { data: sportsList = [], isLoading: isLoadingSports } = useAllSports();
  const updateSportsMutation = useUpdateUserSports();

  const [selectedSportIds, setSelectedSportIds] = useState<string[]>(
    () => user?.sports?.map(s => s.id) ?? []
  );
  const [error, setError] = useState<string | null>(null);

  const toggleSport = (sportId: string) => {
    setSelectedSportIds(prev =>
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
    if (error) setError(null);
  };

  const selectedCount = selectedSportIds.length;
  const isButtonEnabled = selectedCount >= 2 && !updateSportsMutation.isPending;

  const handleContinue = async () => {
    if (selectedCount < 2) return;
    setError(null);
    try {
      await updateSportsMutation.mutateAsync(selectedSportIds);
      await refreshUser();
      router.replace('/(tabs)/explorer' as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('sports.errorSave');
      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PaginationDots total={2} activeIndex={1} variant="dark" />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.title}>{t('sports.title')}</Text>
        <Text style={styles.subtitle}>{t('sports.subtitle')}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {isLoadingSports ? (
        <View style={styles.skeletonGrid}>
          <View style={styles.row}>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
            <View style={styles.cardContainer}><SportCardSkeleton /></View>
          </View>
        </View>
      ) : (
        <FlatList
          data={sportsList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <SportCard
                slug={item.slug}
                label={item.labelFr}
                color={item.color}
                isSelected={selectedSportIds.includes(item.id)}
                onToggle={() => toggleSport(item.id)}
              />
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Button
          label={
            updateSportsMutation.isPending
              ? t('sports.saving')
              : selectedCount > 0
                ? t('sports.continueWithCount', { count: selectedCount })
                : t('sports.continue')
          }
          variant="primary"
          disabled={!isButtonEnabled}
          style={{ opacity: isButtonEnabled ? 1 : 0.5 }}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
    paddingBottom: Spacing.space12,
  },
  textSection: {
    paddingHorizontal: Spacing.space20,
    marginBottom: Spacing.space16,
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: Typography.titre.fontSize,
    color: Colors.light.text,
    marginBottom: Spacing.space4,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  skeletonGrid: {
    paddingBottom: 100,
  },
  listContent: {
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    marginBottom: Spacing.space8,
    gap: Spacing.space8,
  },
  cardContainer: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space32,
    paddingTop: Spacing.space16,
  },
  errorText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.danger,
    marginTop: Spacing.space12,
  },
});
