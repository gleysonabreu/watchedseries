import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateUserService from '@modules/users/services/CreateUserService';

import { sign } from '@shared/services/auth';
import CreateSerieService from '@modules/series/services/CreateSerieService';
import CreateUserSerieService from '@modules/users/services/CreateUserSerieService';
import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

let connection: Connection;
describe('UserSerie', () => {
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

  it('should add a series to my gallery', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/serie')
      .send({
        serieId: serie.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        serieId: serie.id,
        userId: userCreated.id,
      }),
    );
  });

  it('should not add a series to my gallery if serie uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/serie')
      .send({
        serieId: 'invalid-uuid',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not add a series to my gallery if user is unauthenticated', async () => {
    const serieInfo = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const serie = await createSerie.execute(serieInfo);

    const response = await supertest(app).post('/user/serie').send({
      serieId: serie.id,
    });
    expect(response.status).toBe(401);
  });

  it('should not add a series to my gallery with missing fields', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/serie')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not add a series to my gallery if serie uuid does not exist', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/serie')
      .send({
        serieId: '61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should delete an serie from my gallery wtih valid credentials', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/serie/${serie.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an serie when not authenticated', async () => {
    const response = await supertest(app).delete(
      `/user/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`,
    );
    expect(response.status).toBe(401);
  });

  it('should not delete an serie if serie uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/serie/invalid-uuid`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not delete an serie if serie uuid not exists', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should return all series in the gallery from the user authencated', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const userSerie = await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get('/user/serie')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: userSerie.id,
          userId: userSerie.userId,
          serieId: userSerie.serieId,
          serie: expect.objectContaining({
            id: serie.id,
            title: serie.title,
            duration: serie.duration,
            status: serie.status,
            synopsis: serie.synopsis,
            image: serie.image,
          }),
        }),
      ]),
    );
  });

  it('should not return any serie if user does not authenticated', async () => {
    const response = await supertest(app).get('/user/serie');
    expect(response.status).toBe(401);
  });

  it('should return an serie by id if the user is authenticated', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const userSerie = await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/serie/${serie.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: userSerie.id,
        userId: userSerie.userId,
        serieId: userSerie.serieId,
        serie: expect.objectContaining({
          id: serie.id,
          title: serie.title,
          duration: serie.duration,
          status: serie.status,
          synopsis: serie.synopsis,
          image: serie.image,
        }),
      }),
    );
  });

  it('should not return an serie by id if user does not authenticated', async () => {
    const response = await supertest(app).get(
      '/user/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(401);
  });

  it('should not return an serie by id if uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const userSerie = await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });
    const response = await supertest(app)
      .get('/user/serie/shfusgus')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not return an serie by id if uuid does not exist', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createUserSerie = container.resolve(CreateUserSerieService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const userSerie = await createUserSerie.execute({
      serieId: serie.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });
    const response = await supertest(app)
      .get('/user/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});
