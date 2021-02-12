import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@config/crypto';

interface IPayload {
  id: string;
  username: string;
}

const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: config.jwt.duration,
};

const sign = (payload: IPayload) =>
  jwt.sign({ payload }, config.jwt.privateKey, signOptions);

const verify = (token: string) => jwt.verify(token, config.jwt.publicKey);

export { sign, verify };
