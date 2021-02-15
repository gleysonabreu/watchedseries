import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Episode from '../infra/typeorm/entities/Episode';

import IEpisodeRepository from '../repositories/IEpisodeRepository';

interface IRequest {
  page: number;
  perPage: number;
}

interface IResponse {
  episodes: Episode[];
  totalEpisodes: number;
}

@injectable()
class FindAllEpisodesService {
  constructor(
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
  ) {}

  async execute({ page, perPage }: IRequest): Promise<IResponse> {
    perPage = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);
    const schema = Yup.object().shape({
      page: Yup.number().required(),
      perPage: Yup.number().required(),
    });
    await schema.validate({ page, perPage }, { abortEarly: false });

    const take = perPage;
    const skip = (page - 1) * take;
    const totalEpisodes = (await this.episodeRepository.findAll()).length;
    const episodes = await this.episodeRepository.findAll(skip, take);

    return { episodes, totalEpisodes };
  }
}

export default FindAllEpisodesService;
