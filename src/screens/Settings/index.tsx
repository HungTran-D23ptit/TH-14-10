import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../services/firebase';
import {
  logoutUser,
  subscribeToUserProfile,
  UserProfile,
} from '../../services/authService';
import { SettingsTabProps } from '../../navigation/types';

export const SettingsScreen: React.FC<SettingsTabProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      return;
    }

    const unsubscribe = subscribeToUserProfile(currentUid, profile => {
      if (profile) {
        setUserProfile(profile);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    Alert.alert('Xác nhận đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
          } catch {}
          navigation.getParent<any>()?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const displayName =
    userProfile?.displayName || auth.currentUser?.displayName || 'Sinh Viên PTIT';
  const email =
    userProfile?.email || auth.currentUser?.email || 'sinhvien@ptit.edu.vn';
  const avatar =
    userProfile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=007AFF&color=fff&size=150`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.onlineBadge} />
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userBio}>
          {userProfile?.bio || 'Lập trình viên React Native tương lai 🚀'}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã sinh viên</Text>
          <Text style={styles.infoValueHighlight}>
            {userProfile?.studentCode || 'B23DCCC083'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lớp</Text>
          <Text style={styles.infoValue}>
            {userProfile?.className || 'D23CCPM02'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Chuyên ngành</Text>
          <Text style={styles.infoValue}>
            {userProfile?.major || 'Công nghệ thông tin'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại</Text>
          <Text style={styles.infoValue}>
            {userProfile?.phone || '0988 888 888'}
          </Text>
        </View>

        <View style={[styles.infoRow, styles.lastRow]}>
          <Text style={styles.infoLabel}>Trạng thái tài khoản</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Đang hoạt động</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E1E1E1',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 16,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  infoValueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 36,
    backgroundColor: '#FF3B30',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
