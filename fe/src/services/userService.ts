import { EService } from "../enums/services/EService";
import { EUserService } from "../enums/services/EUserService";
import { IUserUpdate } from "../interfaces";
import { instance } from "../lib/axios";

export const userService = {
  updateUser: async (payload: IUserUpdate, headers: any) => {
    const url = `${EService.USER_SERVICE}/${EUserService.UPDATE_PROFILE}`;

    return instance.post(url, payload, { headers });
  },

  sendOtpCode: () => {
    const url = `${EService.USER_SERVICE}/${EUserService.SEND_OTP}`;
    return instance.post(url, {});
  },

  uploadAvatar: (imagePath: any | null, headers: any) => {
    const url = `${EService.USER_SERVICE}/${EUserService.UPLOAD_AVATAR}`;

    return instance.post(url, imagePath, { headers });
  },
};
