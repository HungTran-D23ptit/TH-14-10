import {
  ref,
  push,
  set,
  get,
  onValue,
  DatabaseReference,
} from 'firebase/database';
import { database } from './firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  type: 'text' | 'location';
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  time?: string;
}

export interface ConversationItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageType?: 'text' | 'location';
  timestamp: number;
  time: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface ContactUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  isOnline: boolean;
  status: string;
  lastSeen?: number;
}

export const getChatRoomId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
};

export const formatTime = (timestamp: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Hôm qua';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

export const sendMessage = async (
  senderId: string,
  senderName: string,
  senderAvatar: string,
  recipientId: string,
  recipientName: string,
  recipientAvatar: string,
  content: string,
  type: 'text' | 'location' = 'text',
  locationData?: { latitude: number; longitude: number },
): Promise<void> => {
  const chatRoomId = getChatRoomId(senderId, recipientId);
  const messagesRef: DatabaseReference = ref(database, `messages/${chatRoomId}`);
  const newMessageRef = push(messagesRef);

  const timestamp = Date.now();

  const messagePayload: ChatMessage = {
    id: newMessageRef.key || timestamp.toString(),
    senderId,
    senderName: senderName || 'Người dùng',
    senderAvatar: senderAvatar || '',
    text: content,
    type,
    timestamp,
  };

  if (type === 'location' && locationData) {
    messagePayload.location = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };
  }

  await set(newMessageRef, messagePayload);

  const displaySnippet = type === 'location' ? '📍 [Vị trí đã chia sẻ]' : content;

  const senderConvRef = ref(database, `conversations/${senderId}/${recipientId}`);
  await set(senderConvRef, {
    userId: recipientId,
    name: recipientName || 'Người dùng',
    avatar: recipientAvatar || '',
    lastMessage: displaySnippet,
    lastMessageType: type,
    timestamp,
    unreadCount: 0,
  });

  const recipientConvRef = ref(database, `conversations/${recipientId}/${senderId}`);
  const snap = await get(recipientConvRef);
  const currentUnread = snap.exists() ? (snap.val().unreadCount || 0) : 0;

  await set(recipientConvRef, {
    userId: senderId,
    name: senderName || 'Người dùng',
    avatar: senderAvatar || '',
    lastMessage: displaySnippet,
    lastMessageType: type,
    timestamp,
    unreadCount: currentUnread + 1,
  });
};

export const markConversationAsRead = async (
  currentUserId: string,
  otherUserId: string,
): Promise<void> => {
  try {
    const convRef = ref(database, `conversations/${currentUserId}/${otherUserId}/unreadCount`);
    await set(convRef, 0);
  } catch {}
};

export const subscribeToMessages = (
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void,
) => {
  const messagesRef = ref(database, `messages/${chatRoomId}`);

  return onValue(messagesRef, snapshot => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    const messageList: ChatMessage[] = Object.keys(data).map(key => {
      const msg = data[key];
      return {
        ...msg,
        id: msg.id || key,
        time: formatTime(msg.timestamp),
      };
    });

    messageList.sort((a, b) => a.timestamp - b.timestamp);
    callback(messageList);
  });
};

export const subscribeToConversations = (
  currentUserId: string,
  callback: (conversations: ConversationItem[]) => void,
) => {
  const convRef = ref(database, `conversations/${currentUserId}`);

  return onValue(convRef, snapshot => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    const convList: ConversationItem[] = Object.keys(data).map(key => {
      const item = data[key];
      return {
        id: key,
        userId: item.userId || key,
        name: item.name || 'Người dùng',
        avatar: item.avatar || 'https://ui-avatars.com/api/?name=User',
        lastMessage: item.lastMessage || '',
        lastMessageType: item.lastMessageType || 'text',
        timestamp: item.timestamp || 0,
        time: formatTime(item.timestamp),
        unreadCount: item.unreadCount || 0,
      };
    });

    convList.sort((a, b) => b.timestamp - a.timestamp);
    callback(convList);
  });
};

export const subscribeToContacts = (
  currentUserId: string,
  callback: (contacts: ContactUser[]) => void,
) => {
  const usersRef = ref(database, 'users');

  return onValue(usersRef, snapshot => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    const contactList: ContactUser[] = [];

    Object.keys(data).forEach(key => {
      if (key !== currentUserId) {
        const u = data[key];
        contactList.push({
          id: key,
          name: u.displayName || u.email || 'Người dùng',
          avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || 'U')}`,
          email: u.email || '',
          phone: u.phone || '0988 888 888',
          isOnline: !!u.isOnline,
          status: u.isOnline ? 'Đang hoạt động' : 'Offline',
          lastSeen: u.lastSeen,
        });
      }
    });

    contactList.sort((a, b) => {
      if (a.isOnline === b.isOnline) {
        return a.name.localeCompare(b.name);
      }
      return a.isOnline ? -1 : 1;
    });

    callback(contactList);
  });
};

export const subscribeToUserOnlineStatus = (
  userId: string,
  callback: (isOnline: boolean) => void,
) => {
  const statusRef = ref(database, `users/${userId}/isOnline`);

  return onValue(statusRef, snapshot => {
    if (snapshot.exists()) {
      callback(!!snapshot.val());
    } else {
      callback(false);
    }
  });
};
