import ICreateEpisodeDTO from '../dtos/ICreateEpisodeDTO';
import Episode from '../infra/typeorm/entities/Episode';

export default interface IEpisodeRepository {
  store(episode: ICreateEpisodeDTO): Promise<Episode>;
  delete(episode: Episode): Promise<void>;
  findById(id: string): Promise<Episode | undefined>;
  update(episode: Episode): Promise<Episode>;
  findAll(skip?: number, take?: number): Promise<Episode[]>;
}
