export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Profile: undefined;
};

// les onglets + les écrans qui s'ouvrent par-dessus
export type AppStackParamList = {
  Tabs: undefined;
  CreateAddress: { latitude: number; longitude: number };
};