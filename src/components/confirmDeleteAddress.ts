import { Alert } from 'react-native';
import { deleteAddress } from '../services/addressService';
import { Address } from '../types/models';

// Demande confirmation puis supprime. Appelle onDeleted si succès.
export function confirmDeleteAddress(address: Address, onDeleted?: () => void) {
    Alert.alert(
        "Supprimer l'adresse",
        `Supprimer « ${address.name} » ainsi que ses avis ? Cette action est définitive.`,
        [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteAddress(address.id);
                        onDeleted?.();
                    } catch (e: any) {
                        Alert.alert('Erreur', e?.message ?? 'Suppression impossible');
                    }
                },
            },
        ],
    );
}