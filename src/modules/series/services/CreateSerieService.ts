import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  title: string;
  duration: number;
  launch: Date;
  finished: Date;
  status: string;
  synopsis: string;
  image: string;
}

@injectable()
class CreateSerieService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({
    image,
    duration,
    finished,
    launch,
    status,
    synopsis,
    title,
  }: IRequest): Promise<Serie> {
    const schema = Yup.object().shape({
      title: Yup.string().required().min(1),
      duration: Yup.number().required(),
      launch: Yup.date().required(),
      finished: Yup.date().required(),
      status: Yup.string().required(),
      synopsis: Yup.string().required().min(10),
    });

    await schema.validate(
      { duration, finished, launch, status, synopsis, title },
      { abortEarly: false },
    );

    const findSerieByTitle = await this.serieRepository.findByTitle(title);
    if (findSerieByTitle)
      throw new AppError('This serie title already exists.');

    const serie = await this.serieRepository.store({
      duration,
      finished,
      launch,
      status,
      synopsis,
      title,
      image,
    });
    return serie;
  }
}

export default CreateSerieService;
