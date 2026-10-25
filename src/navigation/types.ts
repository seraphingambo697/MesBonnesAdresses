export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Addresses: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  CreateAddress: { latitude: number; longitude: number };
  AddressDetail: { addressId: string };
};