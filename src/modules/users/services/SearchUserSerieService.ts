import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import UserSerie from '../infra/typeorm/entities/UserSerie';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';
import IUserSerieRepository from '../repositories/IUserSerieRepository';

interface IRequest {
  userId: string;
  page: number;
  perPage: number;
  title: string;
}

interface IResponse {
  userSeries: UserSerie[];
  userEpisodes: UserEpisode[];
  totalSeries: number;
}

@injectable()
class SearchUserSerieService {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,
    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    title,
  }: IRequest): Promise<IResponse> {
    perPage = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      perPage: Yup.number().required(),
      page: Yup.number().required(),
      title: Yup.string().required(),
    });
    await schema.validate(
      { userId, page, perPage, title },
      { abortEarly: false },
    );

    const skip = (page - 1) * perPage;
    const totalSeries = (
      await this.userSerieRepository.search({ title, userId })
    ).length;
    const userSeries = await this.userSerieRepository.search({
      title,
      userId,
      skip,
      take: perPage,
    });
    const userEpisodes = await this.userEpisodeRepository.findAll(userId);

    return { userSeries, userEpisodes, totalSeries };
  }
}

export default SearchUserSerieService;
