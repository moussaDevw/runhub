import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'display'
    | 'titre'
    | 'corps'
    | 'corpsGras'
    | 'meta';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && [styles.linkPrimary, { color: theme.primary }],
        type === 'code' && styles.code,
        type === 'display' && styles.display,
        type === 'titre' && styles.titre,
        type === 'corps' && styles.corps,
        type === 'corpsGras' && styles.corpsGras,
        type === 'meta' && styles.meta,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Brand Typography styles
  display: {
    fontFamily: Typography.display.fontFamily,
    fontSize: Typography.display.fontSize,
    lineHeight: 48,
    fontWeight: '700',
  },
  titre: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: Typography.titre.fontSize,
    lineHeight: 34,
    fontWeight: '700',
  },
  corps: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: Typography.corps.fontSize,
    lineHeight: 24,
  },
  corpsGras: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: Typography.corpsGras.fontSize,
    lineHeight: 24,
    fontWeight: '700',
  },
  meta: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: Typography.meta.fontSize,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Standard component variants aligned with brand
  small: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  default: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  link: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  code: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
});
