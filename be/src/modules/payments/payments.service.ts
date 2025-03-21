import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly secret = process.env.PAYPAL_SECRET;
  private readonly apiUrl = process.env.PAYPAL_API;

  async generateAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString(
      'base64',
    );

    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Bearer ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Unable to fetch PayPal token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async captureOrder(orderId: string): Promise<string> {
    const accessToken = await this.generateAccessToken();
    try {
      const response = await axios.post(
        `${this.apiUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error capturing PayPal order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    try {
      const response = await axios.get(
        `${this.apiUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error capturing PayPal order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
