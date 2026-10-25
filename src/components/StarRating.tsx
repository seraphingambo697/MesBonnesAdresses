import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type StarRatingProps = {
    value: number;
    onChange?: (value: number) => void; // absent = lecture seule
    size?: number;
    testID?: string;
};

const STARS = [1, 2, 3, 4, 5];
const GOLD = '#FFB400';
const GREY = '#D0D0D0';

export function StarRating({ value, onChange, size = 20, testID }: StarRatingProps) {
    return (
        <View testID={testID} style={styles.row} accessibilityLabel={`Note : ${value} sur 5`}>
            {STARS.map((star) => {
                const star_ = (
                    <Text style={{ fontSize: size, color: star <= value ? GOLD : GREY }}>★</Text>
                );
                if (!onChange) return <View key={star}>{star_}</View>;
                return (
                    <Pressable
                        key={star}
                        testID={testID ? `${testID}-${star}` : undefined}
                        onPress={() => onChange(star)}
                        hitSlop={6}
                        accessibilityRole="button"
                        accessibilityLabel={`${star} étoile${star > 1 ? 's' : ''}`}
                    >
                        {star_}
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 4 },
});