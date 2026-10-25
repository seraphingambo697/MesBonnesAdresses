import { PermissionsAndroid, Platform } from 'react-native';

export async function requestLocationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS;
    const result = await PermissionsAndroid.requestMultiple([
        ACCESS_FINE_LOCATION,
        ACCESS_COARSE_LOCATION,
    ]);

    return (
        result[ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
        result[ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
    );
}