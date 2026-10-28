import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  onValue,
  onDisconnect,
  serverTimestamp,
  DatabaseReference,
} from 'firebase/database';
import { auth, database } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: number;
  phone?: string;
  studentCode?: string;
  className?: string;
  major?: string;
  bio?: string;
}

export const getFriendlyErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị khóa.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Tài khoản hoặc mật khẩu không chính xác.';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng bởi một tài khoản khác.';
    case 'auth/weak-password':
      return 'Mật khẩu phải có tối thiểu 6 ký tự.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại internet.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau.';
    default:
      return 'Đã có lỗi xảy ra. Vui lòng thử lại!';
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  pass: string,
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    pass,
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: fullName.trim(),
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName.trim(),
  )}&background=007AFF&color=fff&size=150`;

  const userProfile: UserProfile = {
    uid: user.uid,
    displayName: fullName.trim(),
    email: email.trim(),
    avatar: avatarUrl,
    isOnline: true,
    lastSeen: Date.now(),
    studentCode: 'B23DCCC083',
    className: 'D23CCPM02',
    major: 'Công nghệ thông tin',
    bio: 'PTIT Chat Member 🚀',
    phone: '0988 888 888',
  };

  await set(ref(database, `users/${user.uid}`), userProfile);
  setupPresence(user.uid);

  return user;
};

export const loginUser = async (
  email: string,
  pass: string,
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    pass,
  );
  const user = userCredential.user;

  try {
    const snap = await get(ref(database, `users/${user.uid}`));
    if (!snap.exists()) {
      const name = user.displayName || email.split('@')[0];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=007AFF&color=fff&size=150`;
      await set(ref(database, `users/${user.uid}`), {
        uid: user.uid,
        displayName: name,
        email: user.email || email.trim(),
        avatar: avatarUrl,
        isOnline: true,
        lastSeen: Date.now(),
        studentCode: 'B23DCCC083',
        className: 'D23CCPM02',
        major: 'Công nghệ thông tin',
        bio: 'PTIT Chat Member 🚀',
        phone: '0988 888 888',
      });
    } else {
      await set(ref(database, `users/${user.uid}/isOnline`), true);
      await set(ref(database, `users/${user.uid}/lastSeen`), Date.now());
    }
  } catch {}

  setupPresence(user.uid);

  return user;
};

export const setupPresence = (uid: string) => {
  const connectedRef = ref(database, '.info/connected');
  const userStatusRef = ref(database, `users/${uid}/isOnline`);
  const userLastSeenRef = ref(database, `users/${uid}/lastSeen`);

  const unsubscribe = onValue(connectedRef, snap => {
    if (snap.val() === true) {
      set(userStatusRef, true);
      onDisconnect(userStatusRef).set(false);
      onDisconnect(userLastSeenRef).set(serverTimestamp());
    }
  });

  return unsubscribe;
};

export const logoutUser = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      await set(ref(database, `users/${currentUser.uid}/isOnline`), false);
      await set(ref(database, `users/${currentUser.uid}/lastSeen`), Date.now());
    } catch {}
  }
  await signOut(auth);
};

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const snapshot = await get(ref(database, `users/${uid}`));
    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch {
    return null;
  }
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfile | null) => void,
) => {
  const userRef: DatabaseReference = ref(database, `users/${uid}`);
  return onValue(userRef, snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.val() as UserProfile);
    } else {
      callback(null);
    }
  });
};

export const subscribeToAuthState = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};
