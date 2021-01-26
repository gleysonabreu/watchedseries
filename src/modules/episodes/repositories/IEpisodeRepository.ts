import ICreateEpisodeDTO from '../dtos/ICreateEpisodeDTO';
import Episode from '../infra/typeorm/entities/Episode';

export default interface IEpisodeRepository {
  store(episode: ICreateEpisodeDTO): Promise<Episode>;
}
