import ICreateUserEpisodeDTO from '../dtos/ICreateUserEpisodeDTO';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';

export default interface IUserEpisodeRepository {
  store(userEpisode: ICreateUserEpisodeDTO): Promise<UserEpisode>;
  findEpisodeByIdAndUserId(
    userId: string,
    episodeId: string,
  ): Promise<UserEpisode | undefined>;
  delete(userEpisode: UserEpisode): Promise<void>;
  findAll(userId: string): Promise<UserEpisode[]>;
}
