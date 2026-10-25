import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
    launchCamera,
    launchImageLibrary,
    CameraOptions,
    ImageLibraryOptions,
    ImagePickerResponse,
} from 'react-native-image-picker';

export type PickedImage = {
    uri: string;      // fichier local (aperçu)
    dataUri: string;  // data:image/jpeg;base64
};

const libraryOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.6,
    includeBase64: true,
};

const cameraOptions: CameraOptions = { ...libraryOptions, saveToPhotos: false };

async function ensureCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return result === PermissionsAndroid.RESULTS.GRANTED;
}

function extractImage(res: ImagePickerResponse): PickedImage | null {
    if (res.didCancel) return null;
    if (res.errorCode) throw new Error(res.errorMessage ?? res.errorCode);
    const asset = res.assets?.[0];
    if (!asset?.uri || !asset.base64) return null;
    const type = asset.type ?? 'image/jpeg';
    return { uri: asset.uri, dataUri: `data:${type};base64,${asset.base64}` };
}

export async function takePhoto(): Promise<PickedImage | null> {
    const granted = await ensureCameraPermission();
    if (!granted) {
        Alert.alert('Permission refusée', "L'accès à l'appareil photo est nécessaire.");
        return null;
    }
    return extractImage(await launchCamera(cameraOptions));
}

export async function pickFromGallery(): Promise<PickedImage | null> {
    return extractImage(await launchImageLibrary(libraryOptions));
}

export function chooseImage(): Promise<PickedImage | null> {
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