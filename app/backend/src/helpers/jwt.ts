import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';

import IToken from '../interfaces/token';

const SECRET = readFileSync('jwt.evaluation.key', 'utf-8');

export default class JWT {
  public static generateToken(user: IToken): string {
    return sign(user, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
  }
}
