import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Episode from '../infra/typeorm/entities/Episode';
import IEpisodeRepository from '../repositories/IEpisodeRepository';

interface IRequest {
  page: number;
  perPage: number;
  title: string;
}

interface IResponse {
  episodes: Episode[];
  totalEpisodes: number;
}

@injectable()
class SearchEpisodeService {
  constructor(
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
  ) {}

  async execute({ page, perPage, title }: IRequest): Promise<IResponse> {
    perPage = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);

    const schema = Yup.object().shape({
      perPage: Yup.number().required(),
      page: Yup.number().required(),
      title: Yup.string().required(),
    });
    await schema.validate({ page, perPage, title }, { abortEarly: false });

    const skip = (page - 1) * perPage;
    const totalEpisodes = (await this.episodeRepository.search({ title }))
      .length;
    const episodes = await this.episodeRepository.search({
      title,
      skip,
      take: perPage,
    });

    return { episodes, totalEpisodes };
  }
}

export default SearchEpisodeService;
