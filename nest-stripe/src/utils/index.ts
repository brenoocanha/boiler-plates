import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  generateRandomCode(length: number) {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateHoursFromNow(hours: number) {
    return new Date(Date.now() + 1000 * 60 * 60 * hours);
  }
}
