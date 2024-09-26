import FormData from 'form-data';

export type Message = {
  id?: string;
  text: string;
  senderId: string;
  reciever: string;
};

export enum smsProviderTypes {
  AfricasTalking = 'africasTalking',
  SmartSms = 'smartSms',
  Twilio = 'twilio',
}

export enum otpProviderTypes {
  InfoBip = 'infoBip',
  SmartSms = 'smartSms',
}

export interface MessageReturnType {
  success: boolean;
  message: string;
}

export abstract class SmsBase {
  abstract send(message: Message): Promise<MessageReturnType>;
  abstract getSmsBalance(merchantId: string): Promise<number>;
  abstract getPayload(message: Message): FormData;
}
