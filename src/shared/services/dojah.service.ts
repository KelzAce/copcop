import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DojahService {
  private apiKey: string;
  private appId: string;
  
  constructor( private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DOJAH_API_KEY');
    this.appId = this.configService.get<string>('DOJAH_APP_ID');
  }

  async verifyBvn(bvn: string) {
    const url = `https://api.dojah.io/api/v1/kyc/bvn`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'AppId': this.appId,
    };

    const response = await this.configService.get(url, {
      headers,
      params: { bvn },
    }).toPromise();

    return response.data;
  }
}
