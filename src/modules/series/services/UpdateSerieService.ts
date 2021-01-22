import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  title: string;
  duration: number;
  status: string;
  synopsis: string;
  launch: Date;
  finished: Date;
  id: string;
}

@injectable()
class UpdateSerieService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({
    title,
    duration,
    status,
    synopsis,
    launch,
    finished,
    id,
  }: IRequest): Promise<Serie> {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      status: Yup.string().required(),
      synopsis: Yup.string().required(),
      launch: Yup.date().required(),
      finished: Yup.date().required(),
      id: Yup.string().uuid().required(),
    });
    await schema.validate(
      { title, duration, status, synopsis, launch, finished, id },
      { abortEarly: false },
    );

    const updateSerie = await this.serieRepository.findById(id);
    if (!updateSerie) throw new AppError('This serie does not exist.');

    if (updateSerie.title !== title) {
      const findSerieByTitle = await this.serieRepository.findByTitle(title);
      if (findSerieByTitle) throw new AppError('This title already exist.');
      updateSerie.title = title;
    }

    updateSerie.duration = duration;
    updateSerie.status = status;
    updateSerie.synopsis = synopsis;
    updateSerie.launch = launch;
    updateSerie.finished = finished;
    const serie = await this.serieRepository.update(updateSerie);
    return serie;
  }
}

export default UpdateSerieService;
