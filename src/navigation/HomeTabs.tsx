import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import ChatsScreen from '../screens/Chats';
import ContactsScreen from '../screens/Contacts';
import NotificationsScreen from '../screens/Notifications';
import SettingsScreen from '../screens/Settings';

const homeIcon = require('../assets/home.png');
const userIcon = require('../assets/user.png');
const notificationIcon = require('../assets/notification.png');

interface IconProps {
  color: string;
  size: number;
}

const renderChatsIcon = ({ color, size }: IconProps) => (
  <Image
    source={homeIcon}
    style={[styles.icon, { width: size, height: size, tintColor: color }]}
    resizeMode="contain"
  />
);

const renderContactsIcon = ({ color, size }: IconProps) => (
  <Image
    source={userIcon}
    style={[styles.icon, { width: size, height: size, tintColor: color }]}
    resizeMode="contain"
  />
);

const renderNotificationIcon = ({ color, size }: IconProps) => (
  <Image
    source={notificationIcon}
    style={[styles.icon, { width: size, height: size, tintColor: color }]}
    resizeMode="contain"
  />
);

const renderSettingsIcon = ({ size }: IconProps) => (
  <Text style={{ fontSize: size - 2 }}>⚙️</Text>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

export const HomeTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EBEBEB',
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: '#1C1C1E',
        },
      }}>
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          title: 'Đoạn chat',
          tabBarIcon: renderChatsIcon,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: 'Danh bạ',
          tabBarIcon: renderContactsIcon,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarIcon: renderNotificationIcon,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Cài đặt',
          tabBarIcon: renderSettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {},
});

export default HomeTabs;
