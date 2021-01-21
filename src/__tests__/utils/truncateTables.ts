import { Connection } from 'typeorm';

const truncateTables = async (connection: Connection) => {
  await connection.query('DELETE FROM users_series');
  await connection.query('DELETE FROM users_watched_episodes');
  await connection.query('DELETE FROM episodes');
  await connection.query('DELETE FROM seasons');
  await connection.query('DELETE FROM series');
  await connection.query('DELETE FROM users');
};

export default truncateTables;
