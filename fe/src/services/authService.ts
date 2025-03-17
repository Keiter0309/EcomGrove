import { EAuthService } from "../enums/services/EAuthService";
import { EService } from "../enums/services/EService";
import { IChangePassword, IUserSignup } from "../interfaces";
import { instance } from "../lib/axios";


export const authService = {
  signup: (data: IUserSignup) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.SIGNUP_SERVICE}`;
    return instance.post(url, data);
  },

  login: (email: string, password: string) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.LOGIN_SERVICE}`;
    return instance.post(url, { email, password });
  },

  ggLogin: (credentialResponse: any) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.GOOGLE_SERVICE}`;
    return instance.post(url, { token: credentialResponse.credential });
  },

  logout: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.LOGOUT_SERVICE}`;
    return instance.post(url);
  },

  profile: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.PROFILE_SERVICE}`;
    return instance.get(url);
  },

  changePassword: (payload: IChangePassword, headers: any) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.CHANGE_PASSWORD}`;
    return instance.post(url, payload, { headers });
  },

  checkAuth: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.CHECKAUTH_SERVICE}`;
    return instance.get(url);
  },
};
