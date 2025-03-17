export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface IUserSignup {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface IUserUpdate {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  username: string | undefined;
  phoneNumber: string | undefined;
}

export interface IChangePassword {
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

export interface UpdateProfileRequest {
  userUpdate: IUserUpdate,
  otp: string
}
