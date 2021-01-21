import { container } from 'tsyringe';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import SerieRepository from '@modules/series/infra/typeorm/repositories/SerieRepository';

container.registerSingleton<ISerieRepository>(
  'SerieRepository',
  SerieRepository,
);
