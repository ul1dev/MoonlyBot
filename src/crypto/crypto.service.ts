import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {
  private readonly secretKey = process.env.CRYPTO_SECRET; // Храните ключ в .env

  encrypt(data: any, iv: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey,
      { iv: CryptoJS.enc.Utf8.parse(iv) },
    );
    return encrypted.toString();
  }

  decrypt(encryptedData: string, iv: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey, {
      iv: CryptoJS.enc.Utf8.parse(iv),
    });
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
