import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserSerie from '../infra/typeorm/entities/UserSerie';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';
import IUserSerieRepository from '../repositories/IUserSerieRepository';

interface IRequest {
  userId: string;
  perPage: number;
  page: number;
}

interface IResponse {
  userSeries: UserSerie[];
  userEpisodes: UserEpisode[];
  totalSeries: number;
}

@injectable()
class FindAllUserSerieService {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,

    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  public async execute({
    userId,
    perPage,
    page,
  }: IRequest): Promise<IResponse> {
    perPage = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      page: Yup.number().required(),
      perPage: Yup.number().required(),
    });
    await schema.validate({ userId, page, perPage }, { abortEarly: false });

    const skip = (page - 1) * perPage;
    const totalSeries = (await this.userSerieRepository.findAll(userId)).length;
    const userSeries = await this.userSerieRepository.findAll(
      userId,
      perPage,
      skip,
    );
    const userEpisodes = await this.userEpisodeRepository.findAll(userId);

    return { userSeries, userEpisodes, totalSeries };
  }
}

export default FindAllUserSerieService;
