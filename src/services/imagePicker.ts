import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
    launchCamera,
    launchImageLibrary,
    CameraOptions,
    ImagePickerResponse,
} from 'react-native-image-picker';

const options: CameraOptions = {
    mediaType: 'photo',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.7,
    saveToPhotos: false,
};

async function ensureCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return result === PermissionsAndroid.RESULTS.GRANTED;
}

function extractUri(res: ImagePickerResponse): string | null {
    if (res.didCancel) return null;
    if (res.errorCode) throw new Error(res.errorMessage ?? res.errorCode);
    return res.assets?.[0]?.uri ?? null;
}

export async function takePhoto(): Promise<string | null> {
    const granted = await ensureCameraPermission();
    if (!granted) {
        Alert.alert('Permission refusée', "L'accès à l'appareil photo est nécessaire.");
        return null;
    }
    return extractUri(await launchCamera(options));
}

export async function pickFromGallery(): Promise<string | null> {
    return extractUri(await launchImageLibrary(options));
}

// Propose appareil photo ou galerie, renvoie l'URI choisie (ou null)
export function chooseImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
        Alert.alert(
            'Choisir une photo',
            undefined,
            [
                { text: 'Appareil photo', onPress: () => takePhoto().then(resolve, reject) },
                { text: 'Galerie', onPress: () => pickFromGallery().then(resolve, reject) },
                { text: 'Annuler', style: 'cancel', onPress: () => resolve(null) },
            ],
            { cancelable: true, onDismiss: () => resolve(null) },
        );
    });
}