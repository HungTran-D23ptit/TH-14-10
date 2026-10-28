import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../../services/firebase';
import {
  ChatMessage,
  getChatRoomId,
  markConversationAsRead,
  sendMessage,
  subscribeToMessages,
  subscribeToUserOnlineStatus,
} from '../../services/chatService';
import {
  getCurrentLocation,
  openLocationInMap,
} from '../../services/locationService';
import { ChatDetailScreenProps } from '../../navigation/types';

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { userId: otherUserId, userName, userAvatar, isOnline: initialOnline } =
    route.params;

  const currentUid = auth.currentUser?.uid || '';
  const currentName =
    auth.currentUser?.displayName || auth.currentUser?.email || 'Người dùng';
  const currentAvatar =
    auth.currentUser?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      currentName,
    )}&background=007AFF&color=fff&size=150`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUserOnline, setOtherUserOnline] = useState<boolean>(
    !!initialOnline,
  );
  const [locating, setLocating] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubStatus = subscribeToUserOnlineStatus(
      otherUserId,
      onlineStatus => {
        setOtherUserOnline(onlineStatus);
      },
    );

    return () => {
      unsubStatus();
    };
  }, [otherUserId]);

  useEffect(() => {
    if (!currentUid || !otherUserId) {
      return;
    }

    markConversationAsRead(currentUid, otherUserId);
    const chatRoomId = getChatRoomId(currentUid, otherUserId);

    const unsubMessages = subscribeToMessages(chatRoomId, messageList => {
      setMessages(messageList);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      unsubMessages();
      markConversationAsRead(currentUid, otherUserId);
    };
  }, [currentUid, otherUserId]);

  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !currentUid) {
      return;
    }

    setInputText('');

    try {
      await sendMessage(
        currentUid,
        currentName,
        currentAvatar,
        otherUserId,
        userName,
        userAvatar,
        trimmed,
        'text',
      );
    } catch (error: any) {
      setInputText(trimmed);
      Alert.alert('Lỗi gửi tin nhắn', error?.message || 'Không thể gửi tin nhắn.');
    }
  };

  const handleSendLocation = async () => {
    if (!currentUid || locating) {
      return;
    }

    setLocating(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        await sendMessage(
          currentUid,
          currentName,
          currentAvatar,
          otherUserId,
          userName,
          userAvatar,
          '📍 Vị trí hiện tại',
          'location',
          coords,
        );
      }
    } catch (error: any) {
      Alert.alert('Lỗi chia sẻ vị trí', error?.message || 'Không thể gửi vị trí.');
    } finally {
      setLocating(false);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === currentUid;
    const isLocation = item.type === 'location' && item.location;

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
            isLocation && styles.bubbleLocation,
          ]}>
          {isLocation ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                openLocationInMap(
                  item.location!.latitude,
                  item.location!.longitude,
                )
              }>
              <View style={styles.locationHeaderRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text
                  style={[
                    styles.locationTitle,
                    isMe ? styles.locationTitleMe : styles.locationTitleOther,
                  ]}>
                  Vị trí được chia sẻ
                </Text>
              </View>

              <Text
                style={[
                  styles.coordText,
                  isMe ? styles.coordTextMe : styles.coordTextOther,
                ]}>
                {item.location!.latitude.toFixed(5)},{' '}
                {item.location!.longitude.toFixed(5)}
              </Text>

              <View
                style={[
                  styles.mapBtn,
                  isMe ? styles.mapBtnMe : styles.mapBtnOther,
                ]}>
                <Text
                  style={[
                    styles.mapBtnText,
                    isMe ? styles.mapBtnTextMe : styles.mapBtnTextOther,
                  ]}>
                  🗺️ Mở Google Maps
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.messageText,
                isMe ? styles.messageTextMe : styles.messageTextOther,
              ]}>
              {item.text}
            </Text>
          )}

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 10),
          },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerAvatarContainer}>
          <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
          {otherUserOnline && <View style={styles.headerOnlineDot} />}
        </View>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerName} numberOfLines={1}>
            {userName}
          </Text>
          <Text
            style={[
              styles.headerStatus,
              otherUserOnline
                ? styles.headerStatusOnline
                : styles.headerStatusOffline,
            ]}>
            {otherUserOnline ? 'Đang hoạt động' : 'Offline'}
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
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListEmptyComponent={
          <View style={styles.emptyMessagesContainer}>
            <Text style={styles.emptyMessagesIcon}>👋</Text>
            <Text style={styles.emptyMessagesText}>
              Bắt đầu cuộc trò chuyện với {userName}!
            </Text>
          </View>
        }
      />

      <View
        style={[
          styles.inputContainer,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}>
        <TouchableOpacity
          style={[styles.locationButton, locating && styles.buttonDisabled]}
          onPress={handleSendLocation}
          disabled={locating}
          activeOpacity={0.7}>
          {locating ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.locationButtonText}>📍</Text>
          )}
        </TouchableOpacity>

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
    fontWeight: '500',
  },
  headerStatusOnline: {
    color: '#34C759',
  },
  headerStatusOffline: {
    color: '#8E8E93',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
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
    maxWidth: '78%',
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
  bubbleLocation: {
    minWidth: 210,
    paddingVertical: 12,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  locationTitleMe: {
    color: '#FFFFFF',
  },
  locationTitleOther: {
    color: '#007AFF',
  },
  coordText: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  coordTextMe: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  coordTextOther: {
    color: '#666666',
  },
  mapBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  mapBtnOther: {
    backgroundColor: '#007AFF15',
  },
  mapBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mapBtnTextMe: {
    color: '#FFFFFF',
  },
  mapBtnTextOther: {
    color: '#007AFF',
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  locationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationButtonText: {
    fontSize: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
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
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyMessagesIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyMessagesText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default ChatDetailScreen;
