import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import ISeasonRepository from '@modules/seasons/repositories/ISeasonRepository';
import AppError from '@shared/errors/AppError';
import Episode from '../infra/typeorm/entities/Episode';
import IEpisodeRepository from '../repositories/IEpisodeRepository';

interface IRequest {
  seasonId: string;
  title: string;
  synopsis: string;
  firstAired: Date;
}

@injectable()
class CreateEpisodeService {
  constructor(
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
    @inject('SeasonRepository')
    private seasonRepository: ISeasonRepository,
  ) {}

  public async execute({
    seasonId,
    title,
    synopsis,
    firstAired,
  }: IRequest): Promise<Episode> {
    const schema = Yup.object().shape({
      seasonId: Yup.string().uuid().required(),
      title: Yup.string().required().min(1),
      synopsis: Yup.string().required().min(1),
      firstAired: Yup.date().required(),
    });
    await schema.validate(
      { seasonId, title, synopsis, firstAired },
      { abortEarly: false },
    );

    const season = await this.seasonRepository.findById(seasonId);
    if (!season) throw new AppError('This season does not exist');

    const episode = await this.episodeRepository.store({
      seasonId,
      title,
      synopsis,
      firstAired,
    });
    return episode;
  }
}

export default CreateEpisodeService;
