import { container } from 'tsyringe';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import SerieRepository from '@modules/series/infra/typeorm/repositories/SerieRepository';

import ISeasonRepository from '@modules/seasons/repositories/ISeasonRepository';
import SeasonRepository from '@modules/seasons/infra/typeorm/repositories/SeasonRepository';

import EpisodeRepository from '@modules/episodes/infra/typeorm/repositories/EpisodeRepository';
import IEpisodeRepository from '@modules/episodes/repositories/IEpisodeRepository';

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
