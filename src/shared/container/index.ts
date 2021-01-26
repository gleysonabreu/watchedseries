import { container } from 'tsyringe';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import SerieRepository from '@modules/series/infra/typeorm/repositories/SerieRepository';

import ISeasonRepository from '@modules/seasons/repositories/ISeasonRepository';
import SeasonRepository from '@modules/seasons/infra/typeorm/repositories/SeasonRepository';

container.registerSingleton<ISerieRepository>(
  'SerieRepository',
  SerieRepository,
);

container.registerSingleton<ISeasonRepository>(
  'SeasonRepository',
  SeasonRepository,
);
