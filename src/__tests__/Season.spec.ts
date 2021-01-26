import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import { container } from 'tsyringe';
import CreateSerieService from '@modules/series/services/CreateSerieService';
import CreateSeasonService from '@modules/seasons/services/CreateSeasonService';
import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

let connection: Connection;
describe('Season', () => {
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

  it('should create an season with valid information', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const serieCreated = await createSerie.execute(serie);

    const response = await supertest(app).post('/season').send({
      name: '1º Temporada',
      serieId: serieCreated.id,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        serieId: serieCreated.id,
        name: '1º Temporada',
      }),
    );
  });

  it('should not create an season without missing fields', async () => {
    const response = await supertest(app).post('/season').send({
      name: '1º Temporada',
    });
    expect(response.status).toBe(400);
  });

  it('should not create an season if serie uuid is invalid', async () => {
    const response = await supertest(app).post('/season').send({
      name: '1º Temporada',
      serieId: 'invalid-uuid',
    });
    expect(response.status).toBe(400);
  });

  it('should not create an season if serie does not exist', async () => {
    const response = await supertest(app).post('/season').send({
      name: '1º Temporada',
      serieId: 'f0608c13-584c-45bd-a7ca-128827aa789e',
    });
  });

  it('should delete an season with valid information', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });

    const response = await supertest(app).delete(`/season/${seasonCreated.id}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an season if uuid is not valid', async () => {
    const response = await supertest(app).delete('/season/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should not delete an season if uuid does not exists', async () => {
    const response = await supertest(app).delete(
      '/season/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(400);
  });

  it('should return an season with uuid valid', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });

    const response = await supertest(app).get(`/season/${seasonCreated.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: seasonCreated.id,
        serieId: seasonCreated.serieId,
        name: seasonCreated.name,
      }),
    );
  });

  it('should not return any season if uuid does not exist', async () => {
    const response = await supertest(app).get(
      '/season/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(400);
  });

  it('should not return any season if uuid is not valid', async () => {
    const response = await supertest(app).get('/season/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should return all seasons', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });

    const response = await supertest(app).get('/season');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seasonCreated.id,
          serieId: seasonCreated.serieId,
          name: seasonCreated.name,
        }),
      ]),
    );
  });

  it('should update an season with valid name', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });

    const response = await supertest(app)
      .put(`/season/${seasonCreated.id}`)
      .send({
        name: '1° Temporada',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: '1° Temporada',
      }),
    );
  });

  it('should not update an season without missing fields', async () => {
    const response = await supertest(app).put(
      '/season/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(400);
  });

  it('should not update an season if uuid is invalid', async () => {
    const response = await supertest(app).put('/season/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should not update an season if uuid does not exist', async () => {
    const response = await supertest(app)
      .put('/season/61d9b1dc-262e-4e10-aca3-6780c81aa8b1')
      .send({
        name: '1° Temporada',
      });
    expect(response.status).toBe(400);
  });
});
