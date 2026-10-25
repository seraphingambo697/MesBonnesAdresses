import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeMyAddresses, subscribePublicAddresses } from '../services/addressService';
import { Address } from '../types/models';

type AddressesContextValue = {
    myAddresses: Address[];
    othersAddresses: Address[];
    loading: boolean;
    error: string | null;
};

const AddressesContext = createContext<AddressesContextValue | undefined>(undefined);

export function AddressesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [myAddresses, setMyAddresses] = useState<Address[]>([]);
    const [publicAddresses, setPublicAddresses] = useState<Address[]>([]);
    const [loadingMine, setLoadingMine] = useState(true);
    const [loadingPublic, setLoadingPublic] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const onError = (e: Error) => {
            console.warn('[addresses]', e.message);
            setError(e.message);
            setLoadingMine(false);
            setLoadingPublic(false);
        };

        const unsubMine = subscribeMyAddresses(
            user.uid,
            (list) => {
                setMyAddresses(list);
                setLoadingMine(false);
            },
            onError,
        );

        const unsubPublic = subscribePublicAddresses((list) => {
            setPublicAddresses(list);
            setLoadingPublic(false);
        }, onError);

        return () => {
            unsubMine();
            unsubPublic();
        };
    }, [user]);

    // Adresses publiques des AUTRES utilisateurs
    const othersAddresses = useMemo(
        () => publicAddresses.filter((a) => a.ownerId !== user?.uid),
        [publicAddresses, user],
    );

    const value = useMemo(
        () => ({ myAddresses, othersAddresses, loading: loadingMine || loadingPublic, error }),
        [myAddresses, othersAddresses, loadingMine, loadingPublic, error],
    );

    return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>;
}

export function useAddresses(): AddressesContextValue {
    const ctx = useContext(AddressesContext);
    if (!ctx) throw new Error('useAddresses doit être utilisé dans un AddressesProvider');
    return ctx;
}