import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }

  try {
    const hasFine = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const hasCoarse = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    if (hasFine || hasCoarse) {
      return true;
    }

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    return (
      granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED ||
      granted['android.permission.ACCESS_COARSE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    Alert.alert(
      'Quyền bị từ chối',
      'Ứng dụng không có quyền truy cập vị trí. Vui lòng cấp quyền trong cài đặt để tiếp tục.',
    );
    return null;
  }

  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        Geolocation.getCurrentPosition(
          pos => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          () => {
            resolve({
              latitude: 21.0464,
              longitude: 105.7922,
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000,
          },
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000,
      },
    );
  });
};

export const openLocationInMap = async (latitude: number, longitude: number) => {
  const geoUrl = Platform.select({
    ios: `maps:0,0?q=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
  }) || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  try {
    await Linking.openURL(geoUrl);
  } catch {
    try {
      await Linking.openURL(webUrl);
    } catch {
      Alert.alert('Lỗi', 'Không thể mở Google Maps.');
    }
  }
};
