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
import { ContactItem, MOCK_CONTACTS } from '../../data/mockData';
import { ContactsTabProps } from '../../navigation/types';

export const ContactsScreen: React.FC<ContactsTabProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_CONTACTS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_CONTACTS.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleOpenChat = (item: ContactItem) => {
    navigation.navigate('ChatDetail', {
      userId: item.id,
      userName: item.name,
      userAvatar: item.avatar,
      isOnline: item.isOnline,
    });
  };

  const renderContactItem = ({ item }: { item: ContactItem }) => {
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
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.statusText} numberOfLines={1}>
            {item.status}
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
            placeholder="Tìm kiếm theo tên, số điện thoại..."
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
            <Text style={styles.emptyText}>Không tìm thấy liên hệ nào</Text>
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

export default ContactsScreen;
