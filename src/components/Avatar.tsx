import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export type AvatarProps = {
    uri?: string | null;
    name?: string | null;
    size?: number;
    testID?: string;
};

export function getInitials(name?: string | null): string {
    if (!name?.trim()) return '?';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

export function Avatar({ uri, name, size = 96, testID }: AvatarProps) {
    const dimension = { width: size, height: size, borderRadius: size / 2 };

    if (uri) {
        return <Image testID={testID} source={{ uri }} style={[styles.image, dimension]} />;
    }

    return (
        <View testID={testID} style={[styles.placeholder, dimension]}>
            <Text style={[styles.initials, { fontSize: size / 2.5 }]}>{getInitials(name)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: { backgroundColor: colors.surface },
    placeholder: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    initials: { color: colors.white, fontWeight: '700' },
});