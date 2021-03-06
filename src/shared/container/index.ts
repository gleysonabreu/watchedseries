import { container } from 'tsyringe';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import SerieRepository from '@modules/series/infra/typeorm/repositories/SerieRepository';

import ISeasonRepository from '@modules/seasons/repositories/ISeasonRepository';
import SeasonRepository from '@modules/seasons/infra/typeorm/repositories/SeasonRepository';

import EpisodeRepository from '@modules/episodes/infra/typeorm/repositories/EpisodeRepository';
import IEpisodeRepository from '@modules/episodes/repositories/IEpisodeRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IUserSerieRepository from '@modules/users/repositories/IUserSerieRepository';
import UserSerieRepository from '@modules/users/infra/typeorm/repositories/UserSerieRepository';

import IUserEpisodeRepository from '@modules/users/repositories/IUserEpisodeRepository';
import UserEpisodeRepository from '@modules/users/infra/typeorm/repositories/UserEpisodeRepository';

container.registerSingleton<ISerieRepository>(
  'SerieRepository',
  SerieRepository,
);

container.registerSingleton<ISeasonRepository>(
  'SeasonRepository',
  SeasonRepository,
);

container.registerSingleton<IEpisodeRepository>(
  'EpisodeRepository',
  EpisodeRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserSerieRepository>(
  'UserSerieRepository',
  UserSerieRepository,
);

container.registerSingleton<IUserEpisodeRepository>(
  'UserEpisodeRepository',
  UserEpisodeRepository,
);
