import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { OtpInput } from '../components/OtpInput';
import { useLoginScreen } from './useLoginScreen';

export function LoginScreen() {
  const { t } = useTranslation();
  const {
    loading,
    loadingProvider,
    step,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    emailError,
    otpError,
    resendCountdown,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleResendOtp,
    handleChangeEmail,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleBack,
  } = useLoginScreen();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/bg_home.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'oauth' ? (
              /* ─── Étape 1 : Choix OAuth & Saisie Email ─── */
              <View style={styles.content}>
                <Text style={styles.superTitle}>{t('auth.superTitle')}</Text>
                <Text style={styles.title}>{t('auth.title')}</Text>
                <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

                <View style={styles.buttonsContainer}>
                  {/* Apple Sign In — iOS uniquement */}
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={[styles.oauthBtn, styles.appleBtn]}
                      onPress={handleAppleSignIn}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      {loading && loadingProvider === 'apple' ? (
                        <ActivityIndicator color="#000000" />
                      ) : (
                        <>
                          <Ionicons
                            name="logo-apple"
                            size={22}
                            color="#000000"
                            style={styles.btnIcon}
                          />
                          <Text style={[styles.oauthBtnText, styles.appleBtnText]}>
                            {t('auth.continueWithApple')}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ) : null}

                  {/* Google Sign In */}
                  <TouchableOpacity
                    style={[styles.oauthBtn, styles.googleBtn]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading && loadingProvider === 'google' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <Ionicons
                          name="logo-google"
                          size={20}
                          color="#ffffff"
                          style={styles.btnIcon}
                        />
                        <Text style={[styles.oauthBtnText, styles.googleBtnText]}>
                          {t('auth.continueWithGoogle')}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Séparateur */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>{t('auth.orEmail')}</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Saisie E-mail */}
                  <View style={styles.emailInputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={Colors.light.ink3}
                      style={styles.emailIcon}
                    />
                    <TextInput
                      style={styles.emailInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder={t('auth.emailPlaceholder')}
                      placeholderTextColor="rgba(255, 255, 255, 0.45)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="send"
                      onSubmitEditing={handleSendEmailOtp}
                      editable={!loading}
                    />
                  </View>

                  {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}

                  {/* Bouton Envoyer code */}
                  <TouchableOpacity
                    style={[styles.oauthBtn, styles.emailSubmitBtn]}
                    onPress={handleSendEmailOtp}
                    disabled={loading || !email.trim()}
                    activeOpacity={0.85}
                  >
                    {loading && loadingProvider === 'email' ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <Text style={styles.emailSubmitText}>{t('auth.sendCode')}</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="#ffffff"
                          style={{ marginLeft: 8 }}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* ─── Étape 2 : Saisie Code OTP ─── */
              <View style={styles.content}>
                <Text style={styles.superTitle}>{t('auth.superTitle')}</Text>
                <Text style={styles.title}>{t('auth.enterOtpTitle')}</Text>
                <Text style={styles.subtitle}>
                  {t('auth.enterOtpSubtitle', { email })}
                </Text>

                <TouchableOpacity
                  onPress={handleChangeEmail}
                  style={styles.changeEmailBtn}
                  disabled={loading}
                >
                  <Ionicons name="create-outline" size={16} color={AccentColors.bissap} />
                  <Text style={styles.changeEmailText}>{t('auth.changeEmail')}</Text>
                </TouchableOpacity>

                {/* Composant OTP 6 chiffres */}
                <OtpInput
                  value={otpCode}
                  onChangeCode={(code) => {
                    setOtpCode(code);
                    if (code.length === 6) {
                      handleVerifyEmailOtp(code);
                    }
                  }}
                  error={otpError || undefined}
                  label={t('auth.otpLabel')}
                  disabled={loading}
                />

                {/* Bouton Valider OTP */}
                <TouchableOpacity
                  style={[styles.oauthBtn, styles.emailSubmitBtn]}
                  onPress={() => handleVerifyEmailOtp()}
                  disabled={loading || otpCode.length !== 6}
                  activeOpacity={0.85}
                >
                  {loading && loadingProvider === 'email' ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.emailSubmitText}>{t('auth.verifyAndLogin')}</Text>
                  )}
                </TouchableOpacity>

                {/* Renvoyer le code */}
                <View style={styles.resendContainer}>
                  {resendCountdown > 0 ? (
                    <Text style={styles.resendDisabledText}>
                      {t('auth.resendIn', { seconds: resendCountdown })}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      disabled={loading}
                      style={styles.resendBtn}
                    >
                      <Ionicons name="refresh-outline" size={16} color="#ffffff" />
                      <Text style={styles.resendActiveText}>{t('auth.resendCode')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d161c',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 22, 28, 0.88)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space32,
  },
  superTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: Typography.meta.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.space12,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 32,
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: Spacing.space12,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.ink3,
    lineHeight: 21,
    marginBottom: Spacing.space24,
  },
  buttonsContainer: {
    gap: Spacing.space12,
  },
  oauthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
  },
  btnIcon: {
    marginRight: 12,
  },
  appleBtn: {
    backgroundColor: '#ffffff',
  },
  appleBtnText: {
    color: '#000000',
  },
  googleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  googleBtnText: {
    color: '#ffffff',
  },
  oauthBtnText: {
    fontSize: 15,
    fontFamily: Typography.corpsGras.fontFamily,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.space8,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  dividerText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    height: 52,
  },
  emailIcon: {
    marginRight: 10,
  },
  emailInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: '#ffffff',
    height: '100%',
  },
  fieldErrorText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: '#f87171',
    marginTop: -4,
    marginLeft: 6,
  },
  emailSubmitBtn: {
    backgroundColor: AccentColors.bissap,
  },
  emailSubmitText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: Typography.corpsGras.fontFamily,
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(184, 50, 79, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: Spacing.space16,
  },
  changeEmailText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: AccentColors.bissap,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.space16,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  resendActiveText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  resendDisabledText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
  },
});
