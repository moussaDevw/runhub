import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export interface ScreenProps {
  children: ReactNode;
  /**
   * If true, renders a ScrollView instead of a static View.
   */
  scrollable?: boolean;
  /**
   * Whether to apply safe area inset at the top. Defaults to true.
   */
  safeTop?: boolean;
  /**
   * Whether to apply safe area inset at the bottom. Defaults to true.
   */
  safeBottom?: boolean;
  /**
   * Custom background color. Defaults to theme.background.
   */
  backgroundColor?: string;
  /**
   * Style applied to the outermost screen container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style applied to the ScrollView contentContainer (if scrollable).
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Refreshing state for pull-to-refresh.
   */
  refreshing?: boolean;
  /**
   * Callback when user pulls to refresh.
   */
  onRefresh?: () => void;
  /**
   * Whether to wrap content in a KeyboardAvoidingView. Defaults to false.
   */
  keyboardAvoiding?: boolean;
  /**
   * Additional header or static elements outside the ScrollView.
   */
  header?: ReactNode;
  /**
   * Additional footer or floating elements fixed at bottom.
   */
  footer?: ReactNode;
  /**
   * Test ID for testing.
   */
  testID?: string;
}

export function Screen({
  children,
  scrollable = false,
  safeTop = true,
  safeBottom = true,
  backgroundColor,
  style,
  contentContainerStyle,
  refreshing,
  onRefresh,
  keyboardAvoiding = false,
  header,
  footer,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const resolvedBg = backgroundColor ?? theme.background;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: resolvedBg,
    paddingTop: safeTop ? insets.top : 0,
    paddingBottom: safeBottom ? insets.bottom : 0,
  };

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {header}
      {wrappedContent}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
});
