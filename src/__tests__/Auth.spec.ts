import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateUserService from '@modules/users/services/CreateUserService';

import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

let connection: Connection;
describe('Auth', () => {
  beforeAll(async () => {
    connection = await connect();
  });

  beforeEach(async () => {
    await truncateTables(connection);
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await myConnection.close();
    await connection.close();
  });

  it('should authenticate with valid credentials', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    await createUserService.execute(user);

    const response = await supertest(app).post('/auth').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    await createUserService.execute(user);

    const response = await supertest(app).post('/auth').send({
      email: user.email,
      password: '123474',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    await createUserService.execute(user);

    const response = await supertest(app).post('/auth').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('auth');
  });
});
