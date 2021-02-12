import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';

import app from '@shared/infra/http/app';
import connect from '@shared/infra/typeorm/connection';

import CreateUserService from '@modules/users/services/CreateUserService';

import { sign } from '@shared/services/auth';
import CreateSerieService from '@modules/series/services/CreateSerieService';
import CreateUserSerieService from '@modules/users/services/CreateUserSerieService';
import CreateSeasonService from '@modules/seasons/services/CreateSeasonService';
import CreateEpisodeService from '@modules/episodes/services/CreateEpisodeService';
import CreateUserEpisode from '@modules/users/services/CreateUserEpisode';
import truncateTables from './utils/truncateTables';
import factory from './utils/factory';

let connection: Connection;
describe('UserEpisode', () => {
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

  it('should add a episode to my gallery with valid credentials', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const episodeInfo = await factory.factoryEpisode();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const seasonCreated = await createSeason.execute({
      name: 'First',
      serieId: serie.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episodeInfo,
      seasonId: seasonCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/episode')
      .send({
        episodeId: episodeCreated.id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        episodeId: episodeCreated.id,
        userId: userCreated.id,
      }),
    );
  });

  it('should not add a episode to my gallery with invalid credentials', async () => {
    const serieInfo = await factory.factorySerie();
    const episodeInfo = await factory.factoryEpisode();
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const serie = await createSerie.execute(serieInfo);
    const seasonCreated = await createSeason.execute({
      name: 'First',
      serieId: serie.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episodeInfo,
      seasonId: seasonCreated.id,
    });

    const response = await supertest(app)
      .post('/user/episode')
      .send({
        episodeId: episodeCreated.id,
      })
      .set('Authorization', 'Bearer fasgfiagsfoafoao');
    expect(response.status).toBe(401);
  });

  it('should not add a episode to my gallery with missing fields', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/episode')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not add a episode to my gallery if episode does not exist', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);

    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/episode')
      .send({
        episodeId: '61d9b1dc-262e-4e10-aca3-6780c81aa8b1',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not add a episode to my gallery if episodeId is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);

    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .post('/user/episode')
      .send({
        episodeId: 'fjfgsugfsuofgsfou',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should delete an episode from my gallery with valid credentials', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const episodeInfo = await factory.factoryEpisode();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const createEpOnGallery = container.resolve(CreateUserEpisode);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const seasonCreated = await createSeason.execute({
      name: 'First',
      serieId: serie.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episodeInfo,
      seasonId: seasonCreated.id,
    });
    const episodeGallery = await createEpOnGallery.execute({
      episodeId: episodeCreated.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/episode/${episodeGallery.episodeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an episode from my gallery if uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/episode/invalid-uuid`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not delete an episode from my gallery if uuid does not exist', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/episode/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not delete an episode from my gallery with invalid credentials', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .delete(`/user/episode/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer fshfsofofs`);
    expect(response.status).toBe(401);
  });

  it('should return all episode from my gallery with valid credentials', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const episodeInfo = await factory.factoryEpisode();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const createEpOnGallery = container.resolve(CreateUserEpisode);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const seasonCreated = await createSeason.execute({
      name: 'First',
      serieId: serie.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episodeInfo,
      seasonId: seasonCreated.id,
    });
    await createEpOnGallery.execute({
      episodeId: episodeCreated.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/episode`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: userCreated.id,
          episodeId: episodeCreated.id,
          episode: expect.objectContaining({
            id: episodeCreated.id,
            seasonId: seasonCreated.id,
            title: episodeCreated.title,
            synopsis: episodeCreated.synopsis,
          }),
        }),
      ]),
    );
  });

  it('should not return all episode from my gallery with invalid credentials', async () => {
    const response = await supertest(app)
      .get(`/user/episode`)
      .set('Authorization', `Bearer fsfioshfioshf`);
    expect(response.status).toBe(401);
  });

  it('should not return an episode from my gallery if uuid is invalid', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/episode/invalid-uuid`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not return an episode from my gallery if uuid does not exist', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/episode/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });

  it('should not return an episode from my gallery with invalid credentials', async () => {
    const user = await factory.factoryUser();
    const createUserService = container.resolve(CreateUserService);
    const userCreated = await createUserService.execute(user);
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/episode/61d9b1dc-262e-4e10-aca3-6780c81aa8b1`)
      .set('Authorization', `Bearer fkshfioshfishifgphs`);
    expect(response.status).toBe(401);
  });

  it('should return an episode from my gallery with valid credentials', async () => {
    const user = await factory.factoryUser();
    const serieInfo = await factory.factorySerie();
    const episodeInfo = await factory.factoryEpisode();
    const createUserService = container.resolve(CreateUserService);
    const createSerie = container.resolve(CreateSerieService);
    const createSeason = container.resolve(CreateSeasonService);
    const createEpisode = container.resolve(CreateEpisodeService);
    const createEpOnGallery = container.resolve(CreateUserEpisode);
    const userCreated = await createUserService.execute(user);
    const serie = await createSerie.execute(serieInfo);
    const seasonCreated = await createSeason.execute({
      name: 'First',
      serieId: serie.id,
    });
    const episodeCreated = await createEpisode.execute({
      ...episodeInfo,
      seasonId: seasonCreated.id,
    });
    await createEpOnGallery.execute({
      episodeId: episodeCreated.id,
      userId: userCreated.id,
    });
    const token = sign({ id: userCreated.id, username: userCreated.username });

    const response = await supertest(app)
      .get(`/user/episode/${episodeCreated.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        userId: userCreated.id,
        episodeId: episodeCreated.id,
        episode: expect.objectContaining({
          id: episodeCreated.id,
          seasonId: seasonCreated.id,
          title: episodeCreated.title,
          synopsis: episodeCreated.synopsis,
        }),
      }),
    );
  });
});
