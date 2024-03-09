import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class LibService {
  saveUserImage(name: string, image: Express.Multer.File) {
    writeFile(
      `public/users-images/${name}`,
      new Uint8Array(image.buffer),
      (err) => {
        console.log('User file upload: ' + (err ? err.message : err));
        err && console.log(err);
      },
    );
  }

  generateTokens(payload: any) {
    return {
      accessToken: sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: '24h',
      }),
      refreshToken: sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: '30d',
      }),
    };
  }

  verifyToken(token: string) {
    try {
      return verify(token, process.env.ACCESS_SECRET);
    } catch (e) {
      console.log('verify token: ' + e.message);
      return null;
    }
  }
}
