export interface personal {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  profilePicture?: string;
}

export interface address {
  houseNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

export interface profile {
  personal: personal;
  address: address;
  ordersHistory: null;
}

export interface profileInput {
  section: string;
  label: string;
  fields: Array<{
    label: string;
    type?: string;
    value?: string;
    name?: string;
    isDisable?: boolean
  }>;
}
