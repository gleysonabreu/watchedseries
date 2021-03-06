import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';
import path from 'path';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateSerieService from '@modules/series/services/CreateSerieService';
import CreateSeasonService from '@modules/seasons/services/CreateSeasonService';
import CreateEpisodeService from '@modules/episodes/services/CreateEpisodeService';
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

  it('should delete an episode with valid information', async () => {
    const serie = await factory.factorySerie();
    const episode = await factory.factoryEpisode();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episode,
      seasonId: seasonCreated.id,
    });

    const response = await supertest(app).delete(
      `/episode/${episodeCreated.id}`,
    );
    expect(response.status).toBe(204);
  });

  it('should not delete an episode if uuid is invalid', async () => {
    const response = await supertest(app).delete('/episode/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('should not delete an episode if uuid does not exist', async () => {
    const response = await supertest(app).delete(
      '/episode/f0608c13-584c-45bd-a7ca-128827aa789e',
    );
    expect(response.status).toBe(400);
  });

  it('should find an episode with valid uuid', async () => {
    const serie = await factory.factorySerie();
    const episode = await factory.factoryEpisode();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episode,
      seasonId: seasonCreated.id,
    });

    const response = await supertest(app).get(`/episode/${episodeCreated.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: episodeCreated.id,
        seasonId: episodeCreated.seasonId,
        title: episodeCreated.title,
        synopsis: episodeCreated.synopsis,
        season: expect.objectContaining({
          id: seasonCreated.id,
          serieId: seasonCreated.serieId,
          name: seasonCreated.name,
        }),
        serie: expect.objectContaining({
          id: serieCreated.id,
          title: serieCreated.title,
          duration: serieCreated.duration,
          status: serieCreated.status,
          synopsis: serieCreated.synopsis,
          image: serieCreated.image,
        }),
      }),
    );
  });

  it('should not find an episode if uuid is invalid', async () => {
    const response = await supertest(app).get('/episode/uuid-invalid');
    expect(response.status).toBe(400);
  });

  it('should not find an episode if uuid does not exist', async () => {
    const response = await supertest(app).get(
      '/episode/f0608c13-584c-45bd-a7ca-128827aa789e',
    );
    expect(response.status).toBe(400);
  });

  it('should update an episode with valid information', async () => {
    const serie = await factory.factorySerie();
    const episode = await factory.factoryEpisode();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const serieCreated = await createSerie.execute(serie);
    const seasonCreated = await createSeason.execute({
      name: '1° Season',
      serieId: serieCreated.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episode,
      seasonId: seasonCreated.id,
    });

    const response = await supertest(app)
      .put(`/episode/${episodeCreated.id}`)
      .send({
        title: 'New title',
        synopsis: 'New synopsis',
        firstAired: '02-20-1997',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'New title',
        synopsis: 'New synopsis',
        firstAired: '02-20-1997',
      }),
    );
  });

  it('should not update an episode without missing fields', async () => {
    const response = await supertest(app).put('/episode/:id').send({
      title: 'New title',
      synopsis: 'New synopsis',
    });

    expect(response.status).toBe(400);
  });

  it('should not update an episode if uuid is invalid', async () => {
    const response = await supertest(app).put('/episode/invalid-uuid').send({
      title: 'New title',
      synopsis: 'New synopsis',
      firstAired: '02-20-1997',
    });

    expect(response.status).toBe(400);
  });

  it('should not update an episode if uuid does not exist', async () => {
    const response = await supertest(app)
      .put('/episode/f0608c13-584c-45bd-a7ca-128827aa789e')
      .send({
        title: 'New title',
        synopsis: 'New synopsis',
        firstAired: '02-20-1997',
      });

    expect(response.status).toBe(400);
  });
});
