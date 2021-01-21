import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';
import path from 'path';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';
import CreateSerieService from '@modules/series/services/CreateSerieService';

import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

const imageTest = path.join(__dirname, 'utils', 'images', 'test.png');
let connection: Connection;
describe('Serie', () => {
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

  it('should create an serie with valid information', async () => {
    const serie = await factory.factorySerie();
    const response = await supertest(app)
      .post('/serie')
      .field('title', serie.title)
      .field('duration', serie.duration)
      .field('launch', serie.launch.toString())
      .field('finished', serie.finished.toString())
      .field('status', serie.status)
      .field('synopsis', serie.synopsis)
      .attach('image', imageTest);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: serie.title,
        duration: serie.duration,
        status: serie.status,
        synopsis: serie.synopsis,
      }),
    );
  });

  it('should not create an serie with title already exists', async () => {
    const serie = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    await createSerie.execute(serie);

    const response = await supertest(app)
      .post('/serie')
      .field('title', serie.title)
      .field('duration', serie.duration)
      .field('launch', serie.launch.toString())
      .field('finished', serie.finished.toString())
      .field('status', serie.status)
      .field('synopsis', serie.synopsis)
      .attach('image', imageTest);

    expect(response.status).toBe(400);
  });

  it('shoud not create an serie without image', async () => {
    const serie = await factory.factorySerie();
    const response = await supertest(app)
      .post('/serie')
      .field('title', serie.title)
      .field('duration', serie.duration)
      .field('launch', serie.launch.toString())
      .field('finished', serie.finished.toString())
      .field('status', serie.status)
      .field('synopsis', serie.synopsis);

    expect(response.status).toBe(400);
  });

  it('should not create an serie with missing fields', async () => {
    const serie = await factory.factorySerie();
    const response = await supertest(app)
      .post('/serie')
      .field('title', serie.title)
      .field('duration', serie.duration)
      .field('status', serie.status)
      .field('synopsis', serie.synopsis)
      .attach('image', imageTest);

    expect(response.status).toBe(400);
  });

  it('should delete an serie with valid uuid', async () => {
    const serieInfo = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const serie = await createSerie.execute(serieInfo);

    const response = await supertest(app).delete(`/serie/${serie.id}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an serie if uuid does not exist', async () => {
    const response = await supertest(app).delete(
      '/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(400);
  });

  it('should not delete an serie with invalid uuid', async () => {
    const response = await supertest(app).delete('/serie/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should return all series', async () => {
    const serieInfo = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const serie = await createSerie.execute(serieInfo);

    const response = await supertest(app).get('/serie');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: serie.title,
          duration: serie.duration,
          status: serie.status,
          synopsis: serie.synopsis,
        }),
      ]),
    );
  });

  it('should return serie with valid uuid', async () => {
    const serieInfo = await factory.factorySerie();
    const createSerie = container.resolve(CreateSerieService);
    const serie = await createSerie.execute(serieInfo);

    const response = await supertest(app).get(`/serie/${serie.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: serie.title,
        duration: serie.duration,
        status: serie.status,
        synopsis: serie.synopsis,
      }),
    );
  });

  it('should not return any serie with invalid uuid', async () => {
    const response = await supertest(app).get('/serie/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should not return any serie if uuid does not exist', async () => {
    const response = await supertest(app).get(
      '/serie/61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
    );
    expect(response.status).toBe(400);
  });
});
