import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateUserService from '@modules/users/services/CreateUserService';

import { sign } from '@shared/services/auth';
import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

let connection: Connection;
describe('User', () => {
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

  it('should create an user with valid information', async () => {
    const user = await factory.factoryUser();
    const response = await supertest(app).post('/user').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      }),
    );
  });

  it('should not create an user with missing fields', async () => {
    const user = await factory.factoryUser();
    const response = await supertest(app).post('/user').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });

    expect(response.status).toBe(400);
  });

  it('should not create an user with email invalid', async () => {
    const user = await factory.factoryUser();
    user.email = 'invalid-email';

    const response = await supertest(app).post('/user').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
    });

    expect(response.status).toBe(400);
  });

  it('should not create an user if email already exists', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    await createUserService.execute(user);

    const response = await supertest(app).post('/user').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: 'none',
      password: user.password,
    });

    expect(response.status).toBe(400);
  });

  it('should not create an user if username already exists', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    await createUserService.execute(user);

    const response = await supertest(app).post('/user').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: 'email@qualquer.com',
      username: user.username,
      password: user.password,
    });

    expect(response.status).toBe(400);
  });

  it('should update an user with valid information', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .put('/user')
      .send({
        firstName: 'New Name',
        lastName: 'New Lastname',
        email: 'email@email.com',
        username: 'username',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        firstName: 'New Name',
        lastName: 'New Lastname',
        email: 'email@email.com',
        username: 'username',
      }),
    );
  });

  it('should not update an user with missing fields', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .put('/user')
      .send({
        firstName: 'New Name',
        lastName: 'New Lastname',
        username: 'username',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not update an user if email already exists', async () => {
    const user = await factory.factoryUser();
    const user2 = await factory.factoryUser();
    user2.email = 'haha@haha.com';
    user2.username = 'hahahaha';
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    await createUserService.execute(user2);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .put('/user')
      .send({
        firstName: 'New Name',
        lastName: 'New Lastname',
        email: user2.email,
        username: 'username',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not update an user if username already exists', async () => {
    const user = await factory.factoryUser();
    const user2 = await factory.factoryUser();
    user2.email = 'haha@haha.com';
    user2.username = 'hahahaha';
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    await createUserService.execute(user2);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .put('/user')
      .send({
        firstName: 'New Name',
        lastName: 'New Lastname',
        email: 'qualquer@hotmail.com.br',
        username: user2.username,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not update a user if he is not authenticated', async () => {
    const response = await supertest(app).put('/user');
    expect(response.status).toBe(401);
  });

  it('should delete an user if is authenticated', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an user if he is not authencated', async () => {
    const response = await supertest(app).delete('/user');
    expect(response.status).toBe(401);
  });

  it('should return an user if uuid is valid and user authenticated', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/${userCreated.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    );
  });

  it('should not return an user if user aunthenticated', async () => {
    const response = await supertest(app).get(
      `/user/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`,
    );
    expect(response.status).toBe(401);
  });

  it('should not return an user if uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/invalid-uuid`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not return an user if uuid does not exist', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});
