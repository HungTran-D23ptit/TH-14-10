import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ConversationItem, MOCK_CONVERSATIONS } from '../../data/mockData';
import { ChatsTabProps } from '../../navigation/types';

export const ChatsScreen: React.FC<ChatsTabProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_CONVERSATIONS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_CONVERSATIONS.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.lastMessage.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleOpenChat = (item: ConversationItem) => {
    navigation.navigate('ChatDetail', {
      userId: item.userId,
      userName: item.name,
      userAvatar: item.avatar,
      isOnline: item.isOnline,
    });
  };

  const renderConversationItem = ({ item }: { item: ConversationItem }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        activeOpacity={0.7}
        onPress={() => handleOpenChat(item)}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.lastMessageUnread,
              ]}
              numberOfLines={1}>
              {item.lastMessage}
            </Text>

            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={item => item.id}
        renderItem={renderConversationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>
              Không tìm thấy cuộc trò chuyện nào
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    paddingVertical: 0,
  },
  clearIcon: {
    color: '#8E8E93',
    fontSize: 14,
    padding: 4,
  },
  listContent: {
    paddingVertical: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E1E1E1',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 10,
  },
  lastMessageUnread: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
});

export default ChatsScreen;
