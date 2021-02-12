import IEpisodeRepository from '@modules/episodes/repositories/IEpisodeRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';

interface IRequest {
  userId: string;
  episodeId: string;
}

@injectable()
class CreateUserEpisode {
  constructor(
    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
  ) {}

  async execute({ episodeId, userId }: IRequest): Promise<UserEpisode> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      episodeId: Yup.string().uuid().required(),
    });
    await schema.validate({ episodeId, userId }, { abortEarly: false });

    const episode = await this.episodeRepository.findById(episodeId);
    if (!episode) throw new AppError('This episode does not exist');

    const userEpisode = await this.userEpisodeRepository.findEpisodeByIdAndUserId(
      userId,
      episodeId,
    );
    if (userEpisode) throw new AppError('You watched this episode.');

    const episodeWatched = await this.userEpisodeRepository.store({
      userId,
      episodeId,
    });

    return episodeWatched;
  }
}

export default CreateUserEpisode;
