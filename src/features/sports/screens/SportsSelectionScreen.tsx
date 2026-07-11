import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { SportCard } from '@/components/ui/sport-card';
import { Colors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAllSports, useUpdateUserSports } from '@/features/sports/hooks/useSports';

export function SportsSelectionScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { data: sportsList = [], isLoading: isLoadingSports } = useAllSports();
  const updateSportsMutation = useUpdateUserSports();

  const [selectedSportIds, setSelectedSportIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.sports) {
      setSelectedSportIds(user.sports.map(s => s.id));
    }
  }, [user?.sports]);

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
      const message = err instanceof Error ? err.message : "Erreur lors de l'enregistrement de vos sports.";
      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PaginationDots total={2} activeIndex={1} variant="dark" />
      </View>

      {isLoadingSports ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.light.text} />
        </View>
      ) : (
        <FlatList
          data={sportsList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.textSection}>
              <Text style={styles.title}>Tu kiffes quoi ?</Text>
              <Text style={styles.subtitle}>
                On personnalise ton feed. Choisis au moins 2 sports pour continuer.
              </Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          }
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
              ? 'Enregistrement...'
              : selectedCount > 0
                ? `Continuer · ${selectedCount} choisis`
                : 'Continuer'
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
    backgroundColor: BackgroundThemes.Creme, // #faf6f0
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
    paddingBottom: Spacing.space20,
  },
  textSection: {
    paddingHorizontal: Spacing.space20,
    marginBottom: Spacing.space26,
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: Typography.titre.fontSize,
    color: Colors.light.text, // Nuit text color
    marginBottom: Spacing.space8,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: Typography.corps.fontSize,
    color: '#65625e', // Ink-2 for softer text
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 100, // Space for the fixed footer
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    marginBottom: Spacing.space12,
    gap: Spacing.space12,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: '#C8392F',
    marginTop: Spacing.space12,
  },
});
