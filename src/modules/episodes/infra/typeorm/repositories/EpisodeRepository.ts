import { getRepository, Repository } from 'typeorm';
import IEpisodeRepository from '@modules/episodes/repositories/IEpisodeRepository';
import ICreateEpisodeDTO from '@modules/episodes/dtos/ICreateEpisodeDTO';
import Episode from '../entities/Episode';

class EpisodeRepository implements IEpisodeRepository {
  private ormRepository: Repository<Episode>;

  constructor() {
    this.ormRepository = getRepository(Episode);
  }

  public async store(episode: ICreateEpisodeDTO): Promise<Episode> {
    const createEpisode = this.ormRepository.create(episode);
    const epCreated = await this.ormRepository.save(createEpisode);

    return epCreated;
  }
}

export default EpisodeRepository;
