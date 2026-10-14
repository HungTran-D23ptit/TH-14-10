import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MessageItem, MOCK_MESSAGES } from '../../data/mockData';
import { ChatDetailScreenProps } from '../../navigation/types';

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { userId, userName, userAvatar, isOnline } = route.params;

  const initialMessages = MOCK_MESSAGES[userId] || MOCK_MESSAGES.default;
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) {
      return;
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const newMessage: MessageItem = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: `${hours}:${minutes}`,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageItem = ({ item }: { item: MessageItem }) => {
    const isMe = item.sender === 'me';
    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowOther,
        ]}>
        {!isMe && (
          <Image source={{ uri: userAvatar }} style={styles.messageAvatar} />
        )}

        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
          ]}>
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextOther,
            ]}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.messageTimeMe : styles.messageTimeOther,
            ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerAvatarContainer}>
          <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
          {isOnline && <View style={styles.headerOnlineDot} />}
        </View>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerName} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={styles.headerStatus}>
            {isOnline ? 'Đang hoạt động' : 'Offline'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#8E8E93"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 34,
    color: '#007AFF',
    fontWeight: '300',
    lineHeight: 36,
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerStatus: {
    fontSize: 12,
    color: '#34C759',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  messageTimeOther: {
    color: '#8E8E93',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
    fontSize: 15,
    color: '#000000',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#B0D5FF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2,
  },
});

export default ChatDetailScreen;
