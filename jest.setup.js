jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-safe-area-context', () =>
    require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-image-picker', () => ({
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn(),
}));

jest.mock('@maplibre/maplibre-react-native', () => ({}));