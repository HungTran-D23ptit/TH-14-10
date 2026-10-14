import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ChatDetail: {
    userId: string;
    userName: string;
    userAvatar: string;
    isOnline?: boolean;
  };
};

export type MainTabParamList = {
  Chats: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type ChatDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

export type ChatsTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Chats'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ContactsTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Contacts'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type NotificationsTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SettingsTabProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;
