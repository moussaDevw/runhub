import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { BackgroundThemes, Spacing } from '@/constants/theme';
import { ChatHeader } from '@/components/chat/chat-header';
import { SystemMessage } from '@/components/chat/system-message';
import { ChatMessage } from '@/components/chat/chat-message';
import { LocationAttachment } from '@/components/chat/location-attachment';
import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { DUMMY_EVENT_DETAILS } from '@/data/mock-data';

export function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER */}
      <ChatHeader 
        title={DUMMY_EVENT_DETAILS.title}
        subtitle="32 membres • Dakar Runners"
        imageSource={DUMMY_EVENT_DETAILS.imageSource}
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
          <SystemMessage text="Tu as rejoint la discussion - 32 membres" />

          <ChatMessage 
            id="1"
            isSender={false}
            text="Salut la team ✌️ RDV demain 18h30 au Monument, on part à 18h45 pile"
            user={{ name: 'Aïssatou', role: 'orga', initials: 'AD', bgColor: '#f2784f' }}
          />

          <ChatMessage 
            id="2"
            isSender={false}
            text="Présent ! Quelqu'un fait le 10k ?"
            user={{ name: 'Moussa', initials: 'MS', bgColor: '#c64a86' }}
          />

          <ChatMessage 
            id="3"
            isSender={false}
            text="Moi le 10k 💪 on se motive"
            user={{ name: 'Fatou', initials: 'FN', bgColor: '#2c7a55' }}
          />

          <ChatMessage 
            id="4"
            isSender={true}
            text="Je serai là, 5k pour moi cette fois 🤩"
            time="18:30"
            isRead={true}
          />

          <ChatMessage 
            id="5"
            isSender={false}
            text="Parfait 🔥 Pensez à prendre de l'eau, il fait encore chaud à cette heure ☀️"
            user={{ name: 'Aïssatou', role: 'orga', initials: 'AD', bgColor: '#f2784f' }}
          />

          <ChatMessage 
            id="6"
            isSender={false}
            text="On se retrouve où exactement ?"
            user={{ name: 'Khadim', initials: 'KB', bgColor: '#b78ad6' }}
          />

          <ChatMessage 
            id="7"
            isSender={false}
            text="Au pied du Monument de la Renaissance, côté Corniche 📍"
            user={{ name: 'Aïssatou', role: 'orga', initials: 'AD', bgColor: '#f2784f' }}
          />

          <ChatMessage 
            id="8"
            isSender={false}
            user={{ name: 'Aïssatou', role: 'orga', initials: 'AD', bgColor: '#f2784f' }}
          >
            <LocationAttachment title="Monument de la Renaissance" />
          </ChatMessage>

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
