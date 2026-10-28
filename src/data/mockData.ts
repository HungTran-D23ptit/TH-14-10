export interface ConversationItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface ContactItem {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  isOnline: boolean;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

export interface MessageItem {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'c1',
    userId: 'u1',
    name: 'Nguyễn Văn An',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    lastMessage: 'Chiều nay có đi đá bóng không bạn ơi?',
    time: '14:25',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'c2',
    userId: 'u2',
    name: 'Trần Thị Mai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Đã gửi tài liệu môn Lập trình di động nhé',
    time: '13:40',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'c3',
    userId: 'u3',
    name: 'Lê Hoàng Long',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    lastMessage: 'Okie, hẹn gặp ở giảng đường A2 lúc 3h',
    time: '11:15',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'c4',
    userId: 'u4',
    name: 'Phạm Minh Tuấn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Cậu làm xong bài tập lớn React Native chưa?',
    time: 'Hôm qua',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'c5',
    userId: 'u5',
    name: 'Hoàng Thùy Linh',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: 'Cảm ơn bạn nhiều nha! 🥰',
    time: 'Hôm qua',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'c6',
    userId: 'u6',
    name: 'Đặng Quốc Huy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: 'Nhóm mình nộp slide trước 24h tối nay nhé',
    time: '12/10',
    unreadCount: 3,
    isOnline: false,
  },
];

export const MOCK_CONTACTS: ContactItem[] = [
  {
    id: 'u1',
    name: 'Nguyễn Văn An',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    phone: '0912 345 678',
    isOnline: true,
    status: 'Đang bận học React Native...',
  },
  {
    id: 'u2',
    name: 'Trần Thị Mai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '0988 765 432',
    isOnline: true,
    status: 'Sống là cống hiến ✨',
  },
  {
    id: 'u3',
    name: 'Lê Hoàng Long',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    phone: '0903 112 233',
    isOnline: false,
    status: 'Đang offline',
  },
  {
    id: 'u4',
    name: 'Phạm Minh Tuấn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '0977 445 566',
    isOnline: false,
    status: 'Code xuyên màn đêm 💻',
  },
  {
    id: 'u5',
    name: 'Hoàng Thùy Linh',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    phone: '0934 998 877',
    isOnline: true,
    status: 'Yêu màu hồng ghét sự giả dối',
  },
  {
    id: 'u6',
    name: 'Đặng Quốc Huy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '0945 667 889',
    isOnline: false,
    status: 'Học, học nữa, học mãi...',
  },
  {
    id: 'u7',
    name: 'Vũ Bích Ngọc',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    phone: '0966 223 344',
    isOnline: true,
    status: 'Sẵn sàng trò chuyện!',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Tin nhắn mới',
    content: 'Nguyễn Văn An đã gửi cho bạn 2 tin nhắn mới.',
    time: '5 phút trước',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Yêu cầu kết bạn',
    content: 'Vũ Bích Ngọc đã chấp nhận lời mời kết bạn của bạn.',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Thông báo hệ thống',
    content: 'Cập nhật phiên bản ChatApp v2.0 thành công.',
    time: 'Hôm qua',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Nhắc nhở nhóm',
    content: 'Đặng Quốc Huy vừa nhắc bạn trong nhóm Bài tập lớn PTIT.',
    time: '2 ngày trước',
    isRead: true,
  },
  {
    id: 'n5',
    title: 'Bảo mật tài khoản',
    content: 'Phát hiện đăng nhập mới từ thiết bị Android tại Hà Nội.',
    time: '3 ngày trước',
    isRead: true,
  },
];

export const MOCK_MESSAGES: Record<string, MessageItem[]> = {
  u1: [
    { id: 'm1', sender: 'other', text: 'Chào An nhé, bài tập hôm trước làm đến đâu rồi?', time: '14:20' },
    { id: 'm2', sender: 'me', text: 'Mình xong phần giao diện rồi, đang ráp phần Navigation!', time: '14:22' },
    { id: 'm3', sender: 'other', text: 'Tuyệt quá! Chiều nay có đi đá bóng không bạn ơi?', time: '14:25' },
  ],
  default: [
    { id: 'm1', sender: 'other', text: 'Chào bạn! Rất vui được kết nối.', time: '10:00' },
    { id: 'm2', sender: 'me', text: 'Chào bạn, chúc một ngày làm việc hiệu quả nhé!', time: '10:02' },
  ],
};

export const CURRENT_USER = {
  id: 'me',
  name: 'Trần Duy Hưng',
  studentCode: 'B23DCCC083',
  className: 'D23CCPM02',
  major: 'Cử nhân Công nghệ thông tin',
  email: 'B23DCCC083@ptit.edu.vn',
  phone: '0988 888 888',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  bio: 'Lập trình viên React Native tương lai 🚀',
};
