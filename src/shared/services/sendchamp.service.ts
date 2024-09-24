import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';

@Injectable()
export class SendChampService {
  private readonly logger = new Logger(SendChampService.name);
  private lastOTPSentAt: Date | null = null;  // To track when the OTP was last sent

  constructor(private readonly configService: ConfigService) {}

  // Method to send OTP to the provided email
  async sendOTPToEmail(email: string, firstName: string): Promise<any> {
    const options = {
      method: 'POST',
      url: `${this.configService.get('BASE_URL')}/otp/send`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Token': this.configService.get('SENDCHAMP_TOKEN'),
      },
      data: {
        channel: "email",
        token_type: "numeric",
        sender: "Sendchamp",
        token_length: "6",
        expiration_time: 6,  // OTP expires in 6 minutes
        email: email,
        meta_data: {
          first_name: firstName
        }
      }
    };

    try {
      const response = await axios(options);
      this.logger.log(`OTP sent to email: ${email}`);
      this.lastOTPSentAt = new Date();  // Update the time when OTP is sent
      return response.data;  // Return the response data
    } catch (error) {
      this.logger.error('Error sending OTP:', error.message);
      throw new Error(error.message);  // Re-throw the error for further handling
    }
  }

  // Method to verify OTP provided by the user
  async verifyOTP(email: string, otp: string): Promise<any> {
    const options = {
      method: 'POST',
      url: `${this.configService.get('BASE_URL')}/otp/verify`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Token': this.configService.get('SENDCHAMP_TOKEN'),
      },
      data: {
        channel: "email",
        token: otp,
        email: email
      }
    };

    try {
      const response = await axios(options);
      this.logger.log(`OTP verified for email: ${email}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error verifying OTP:', error.message);
      throw new Error(error.message);
    }
  }

  // Method to resend OTP after 1 minute
  async resendOTP(email: string, firstName: string): Promise<any> {
    // Check if 1 minute has passed since the last OTP was sent
    const oneMinute = 60 * 1000;  // 1 minute in milliseconds
    if (this.lastOTPSentAt && (new Date().getTime() - this.lastOTPSentAt.getTime()) < oneMinute) {
      const timeRemaining = Math.ceil((oneMinute - (new Date().getTime() - this.lastOTPSentAt.getTime())) / 1000);
      throw new Error(`You need to wait ${timeRemaining} more seconds to resend OTP.`);
    }

    // If 1 minute has passed, send a new OTP
    return this.sendOTPToEmail(email, firstName);
  }

  async createAccount(email: string, firstName: string): Promise<any> {
    const options = {
      method: 'POST',
      url: `${this.configService.get('BASE_URL')}/account/create`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Token': this.configService.get('SENDCHAMP_TOKEN'),
      },
      data: {
        email: email,
        firstName: firstName
      }
    };

    try {
      const response = await axios(options);
      this.logger.log(`Account created for email: ${email}`);
      return response.data;  // Return response data on success
    } catch (error) {
      this.logger.error('Error creating account:', error.message);
      throw new Error(error.message);
    }
  }
}
