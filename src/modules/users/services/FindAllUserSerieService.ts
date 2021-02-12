import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserSerie from '../infra/typeorm/entities/UserSerie';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';
import IUserSerieRepository from '../repositories/IUserSerieRepository';

interface IRequest {
  userId: string;
}

interface IResponse {
  userSeries: UserSerie[];
  userEpisodes: UserEpisode[];
}

@injectable()
class FindAllUserSerieService {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,

    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<IResponse> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId }, { abortEarly: false });

    const userSeries = await this.userSerieRepository.findAll(userId);
    const userEpisodes = await this.userEpisodeRepository.findAll(userId);

    return { userSeries, userEpisodes };
  }
}

export default FindAllUserSerieService;
