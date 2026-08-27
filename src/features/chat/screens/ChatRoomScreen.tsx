import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { BackgroundThemes, Spacing, AccentColors } from '@/constants/theme';
import { ChatHeader } from '@/components/chat/chat-header';
import { SystemMessage } from '@/components/chat/system-message';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { useEventDetail } from '@/features/events/hooks/useEvents';
import { getEventImageSource } from '@/features/events/utils/event.utils';

export function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const eventId = typeof id === 'string' ? id : '';

  const { data: event, isLoading } = useEventDetail(eventId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AccentColors.bissap} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER */}
      <ChatHeader 
        title={event?.title || 'Discussion'}
        subtitle={`${event?._count?.registrations || 1} participant(s) • ${event?.sport?.labelFr || ''}`}
        imageSource={getEventImageSource(event?.coverUrl)}
        onEventPress={() => router.back()} // Go back to event details
      />

      {/* CHAT MESSAGES */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.messagesContainer} 
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          <SystemMessage text="AUJOURD'HUI" />
          <SystemMessage text={`Tu as rejoint la discussion - ${event?._count?.registrations || 1} membre(s)`} />

          <ChatMessage 
            id="1"
            isSender={false}
            text="Salut la team ✌️ RDV à l'heure indiquée, on démarre pile à l'heure !"
            user={{ name: event?.organizer?.firstName || 'Organisateur', role: 'orga', initials: `${(event?.organizer?.firstName || 'O')[0]}${(event?.organizer?.lastName || 'R')[0]}`.toUpperCase(), bgColor: event?.sport?.color || '#f2784f' }}
          />

          <ChatMessage 
            id="2"
            isSender={true}
            text="Je serai présent ! Hâte de commencer cette session 💪"
            time="18:30"
            isRead={true}
          />
        </ScrollView>

        {/* INPUT BAR */}
        <ChatInputBar />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4', // Brume for chat background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BackgroundThemes.Ivoire,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: 24,
    paddingBottom: 24,
  },
});
