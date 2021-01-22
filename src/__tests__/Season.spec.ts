import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import { container } from 'tsyringe';
import CreateSerieService from '@modules/series/services/CreateSerieService';
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
});
