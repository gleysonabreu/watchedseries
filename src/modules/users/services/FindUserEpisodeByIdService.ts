import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';

interface IRequest {
  userId: string;
  episodeId: string;
}

@injectable()
class FindUserEpisodeByIdService {
  constructor(
    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  async execute({ userId, episodeId }: IRequest): Promise<UserEpisode> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      episodeId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId, episodeId }, { abortEarly: false });

    const userEpisode = await this.userEpisodeRepository.findEpisodeByIdAndUserId(
      userId,
      episodeId,
    );
    if (!userEpisode) throw new AppError('This episode does not exist');

    return userEpisode;
  }
}

export default FindUserEpisodeByIdService;
