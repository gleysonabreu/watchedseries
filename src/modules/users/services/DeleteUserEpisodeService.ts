import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';

interface IRequest {
  episodeId: string;
  userId: string;
}

@injectable()
class DeleteUserEpisodeService {
  constructor(
    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  async execute({ episodeId, userId }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      episodeId: Yup.string().uuid().required(),
      userId: Yup.string().uuid().required(),
    });
    await schema.validate({ episodeId, userId }, { abortEarly: false });

    const userEpisode = await this.userEpisodeRepository.findEpisodeByIdAndUserId(
      userId,
      episodeId,
    );
    if (!userEpisode) throw new AppError('This episode does not exist');

    await this.userEpisodeRepository.delete(userEpisode);
  }
}

export default DeleteUserEpisodeService;
