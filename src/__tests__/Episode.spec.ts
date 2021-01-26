import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';
import path from 'path';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateSerieService from '@modules/series/services/CreateSerieService';
import CreateSeasonService from '@modules/seasons/services/CreateSeasonService';
import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

const imageTest = path.join(__dirname, 'utils', 'images', 'test.png');
let connection: Connection;
describe('Episode', () => {
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

  it('should create an episode with valid information', async () => {
    const serie = await factory.factorySerie();
    const episode = await factory.factoryEpisode();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });

    const response = await supertest(app).post('/episode').send({
      seasonId: seasonCreated.id,
      title: episode.title,
      synopsis: episode.synopsis,
      firstAired: episode.firstAired,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: episode.title,
        synopsis: episode.synopsis,
      }),
    );
  });

  it('should not create an episode with missing fields', async () => {
    const episode = await factory.factoryEpisode();
    const response = await supertest(app).post('/episode').send({
      seasonId: 'f0608c13-584c-45bd-a7ca-128827aa789e',
      title: episode.title,
      synopsis: episode.synopsis,
    });
    expect(response.status).toBe(400);
  });

  it('should not create an episode if seasonId does not exist', async () => {
    const episode = await factory.factoryEpisode();
    const response = await supertest(app).post('/episode').send({
      seasonId: 'f0608c13-584c-45bd-a7ca-128827aa789e',
      title: episode.title,
      synopsis: episode.synopsis,
      firstAired: episode.firstAired,
    });
    expect(response.status).toBe(400);
  });

  it('should not create an episode if uuid is invalid', async () => {
    const episode = await factory.factoryEpisode();
    const response = await supertest(app).post('/episode').send({
      seasonId: 'invalid-uuid',
      title: episode.title,
      synopsis: episode.synopsis,
      firstAired: episode.firstAired,
    });
    expect(response.status).toBe(400);
  });
});
