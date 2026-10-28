import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../services/firebase';
import {
  ContactUser,
  subscribeToContacts,
} from '../../services/chatService';
import { ContactsTabProps } from '../../navigation/types';

export const ContactsScreen: React.FC<ContactsTabProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid || '';
    const unsubscribe = subscribeToContacts(currentUid, contactList => {
      setContacts(contactList);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }
    const query = searchQuery.toLowerCase().trim();
    return contacts.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        (item.phone && item.phone.toLowerCase().includes(query)),
    );
  }, [contacts, searchQuery]);

  const handleOpenChat = (item: ContactUser) => {
    navigation.navigate('ChatDetail', {
      userId: item.id,
      userName: item.name,
      userAvatar: item.avatar,
      isOnline: item.isOnline,
    });
  };

  const renderContactItem = ({ item }: { item: ContactUser }) => {
    return (
      <TouchableOpacity
        style={styles.contactItem}
        activeOpacity={0.7}
        onPress={() => handleOpenChat(item)}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View
            style={[
              styles.statusDot,
              item.isOnline ? styles.onlineDot : styles.offlineDot,
            ]}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.statusText} numberOfLines={1}>
            {item.email || item.status}
          </Text>
        </View>

        <View style={styles.rightAction}>
          <View
            style={[
              styles.badgeContainer,
              item.isOnline ? styles.badgeOnline : styles.badgeOffline,
            ]}>
            <Text
              style={[
                styles.badgeText,
                item.isOnline ? styles.badgeTextOnline : styles.badgeTextOffline,
              ]}>
              {item.isOnline ? 'Online' : 'Offline'}
            </Text>
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
            placeholder="Tìm kiếm người dùng qua tên, email..."
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải danh bạ từ Firebase...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              Tất cả liên hệ ({filteredContacts.length})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? 'Không tìm thấy liên hệ phù hợp'
                  : 'Chưa có người dùng nào khác đăng ký'}
              </Text>
            </View>
          }
        />
      )}
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 16,
  },
  contactItem: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1E1E1',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineDot: {
    backgroundColor: '#34C759',
  },
  offlineDot: {
    backgroundColor: '#8E8E93',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  rightAction: {
    marginLeft: 8,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeOnline: {
    backgroundColor: '#E8F8EE',
  },
  badgeOffline: {
    backgroundColor: '#F2F2F7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextOnline: {
    color: '#34C759',
  },
  badgeTextOffline: {
    color: '#8E8E93',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ContactsScreen;
