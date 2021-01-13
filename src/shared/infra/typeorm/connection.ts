import { Connection, createConnection } from 'typeorm';
import ormConfig from '@config/ormconfig';

export default async (name = 'default'): Promise<Connection> => {
  return createConnection(
    Object.assign(ormConfig, {
      name,
    }),
  );
};
