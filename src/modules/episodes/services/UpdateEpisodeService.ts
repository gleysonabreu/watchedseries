import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Episode from '../infra/typeorm/entities/Episode';
import IEpisodeRepository from '../repositories/IEpisodeRepository';

interface IRequest {
  id: string;
  firstAired: Date;
  title: string;
  synopsis: string;
}

@injectable()
class UpdateEpisodeService {
  constructor(
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
  ) {}

  public async execute({
    id,
    title,
    synopsis,
    firstAired,
  }: IRequest): Promise<Episode> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      title: Yup.string().required().min(1),
      synopsis: Yup.string().required().min(1),
      firstAired: Yup.date().required(),
    });
    await schema.validate(
      { id, title, synopsis, firstAired },
      { abortEarly: false },
    );

    const episode = await this.episodeRepository.findById(id);
    if (!episode) throw new AppError('This episode does not exist');

    episode.firstAired = firstAired;
    episode.title = title;
    episode.synopsis = synopsis;
    const updateEpisode = await this.episodeRepository.update(episode);

    return updateEpisode;
  }
}

export default UpdateEpisodeService;
