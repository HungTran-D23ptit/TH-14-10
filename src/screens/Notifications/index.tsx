import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MOCK_NOTIFICATIONS, NotificationItem } from '../../data/mockData';
import { NotificationsTabProps } from '../../navigation/types';

export const NotificationsScreen: React.FC<NotificationsTabProps> = () => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  const unreadCount = notifications.filter(item => !item.isRead).length;

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.notificationItemUnread,
        ]}
        activeOpacity={0.7}
        onPress={() => handleMarkAsRead(item.id)}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🔔</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.title,
                !item.isRead && styles.titleUnread,
              ]}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.contentText}>{item.content}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.summaryText}>
          {unreadCount > 0
            ? `${unreadCount} thông báo chưa đọc`
            : 'Tất cả thông báo đã đọc'}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllButton}>Đánh dấu đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔕</Text>
            <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  markAllButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  notificationItemUnread: {
    backgroundColor: '#F0F7FF',
    borderColor: '#D0E5FF',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  iconText: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  titleUnread: {
    color: '#000000',
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 6,
  },
  contentText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyContainer: {
    paddingTop: 80,
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

export default NotificationsScreen;
