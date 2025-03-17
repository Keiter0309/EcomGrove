import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendResetPasswordOtp(
    email: string,
    username: string,
    otp: string,
    expiry: Date,
  ) {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333;">Password Reset</h1>
        <p>Hello, ${username}</p>
        <p>Your OTP for password reset is:</p>
        <h2 style="color: #2196f3; letter-spacing: 2px;">${otp}</h2>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Application Team</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset OTP',
        html: htmlTemplate,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
  async sendResetPasswordSuccess(email: string, username: string) {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #4CAF50;">Password Reset Successful</h1>
        <p>Hello, ${username}</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not perform this action, please contact our support team immediately.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Application Team</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Successful',
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendConfirmChangeInfoOtp(email: string, username: string, otp: string) {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333;">Confirm Your Identity</h1>
        <p>Hello, ${username}</p>
        <p>Your OTP for confirm your identity is:</p>
        <h2 style="color: #2196f3; letter-spacing: 2px;">${otp}</h2>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Application Team</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirm Your Identity',
        html: htmlTemplate,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendPasswordChangeNotification(email: string, username: string) {
    const htmlTemplate = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .content {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 15px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Password Change Notification</div>
          <div class="content">
            <p>Hi <strong>${username}</strong>,</p>
            <p>This is to confirm that your password has been successfully changed.</p>
            <p>If you did not request this change, please reset your password immediately and contact our support team.</p>
            <a href="https://yourwebsite.com/reset-password" class="button">Reset Password</a>
          </div>
          <div class="footer">
            <p>If you need further assistance, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Password Change Notification",
        html: htmlTemplate
      });
    } catch (error) {
      console.error("Email sending failed", error.message);
      throw error;
    }
  }
}
