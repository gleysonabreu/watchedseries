import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';

interface IRequest {
  userId: string;
}

@injectable()
class FindAllUserEpisodeService {
  constructor(
    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<UserEpisode[]> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId }, { abortEarly: false });

    const userEpisodes = await this.userEpisodeRepository.findAll(userId);
    return userEpisodes;
  }
}

export default FindAllUserEpisodeService;
