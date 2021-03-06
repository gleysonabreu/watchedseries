import { getRepository, Repository, Like } from 'typeorm';
import IEpisodeRepository from '@modules/episodes/repositories/IEpisodeRepository';
import ICreateEpisodeDTO from '@modules/episodes/dtos/ICreateEpisodeDTO';
import ISearchEpisodeDTO from '@modules/episodes/dtos/ISearchEpisodeDTO';
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

  public async findById(id: string): Promise<Episode | undefined> {
    const episode = await this.ormRepository.findOne(
      { id },
      { relations: ['season', 'season.serie'] },
    );
    return episode;
  }

  public async delete(episode: Episode): Promise<void> {
    await this.ormRepository.remove(episode);
  }

  public async update(episodeUpdate: Episode): Promise<Episode> {
    const episode = await this.ormRepository.save(episodeUpdate);
    return episode;
  }

  async findAll(skip: number = 0, take: number = 0): Promise<Episode[]> {
    const episodes = await this.ormRepository.find({
      skip,
      take,
      relations: ['season', 'season.serie'],
    });
    return episodes;
  }

  async search({
    take = 0,
    skip = 0,
    title,
  }: ISearchEpisodeDTO): Promise<Episode[]> {
    const episodes = await this.ormRepository.find({
      take,
      skip,
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['season', 'season.serie'],
    });
    return episodes;
  }
}

export default EpisodeRepository;
