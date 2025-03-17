export class UtilOtp {
  static generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  }

  static getOtpExpiration(minutes: number = 15): Date {
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + minutes);
    return otpExpiration;
  }
}
