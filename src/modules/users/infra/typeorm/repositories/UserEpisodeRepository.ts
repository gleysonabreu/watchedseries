import { getRepository, Repository } from 'typeorm';
import IUserEpisodeRepository from '@modules/users/repositories/IUserEpisodeRepository';
import UserEpisode from '@modules/users/infra/typeorm/entities/UserEpisode';
import ICreateUserEpisodeDTO from '@modules/users/dtos/ICreateUserEpisodeDTO';

class UserEpisodeRepository implements IUserEpisodeRepository {
  private ormRepository: Repository<UserEpisode>;

  constructor() {
    this.ormRepository = getRepository(UserEpisode);
  }

  public async store(userEpisode: ICreateUserEpisodeDTO): Promise<UserEpisode> {
    const createUserEpisode = this.ormRepository.create(userEpisode);
    const episode = await this.ormRepository.save(createUserEpisode);
    return episode;
  }

  async findEpisodeByIdAndUserId(
    userId: string,
    episodeId: string,
  ): Promise<UserEpisode | undefined> {
    const userEpisode = await this.ormRepository.findOne({
      where: {
        userId,
        episodeId,
      },
    });
    return userEpisode;
  }

  async delete(userEpisode: UserEpisode): Promise<void> {
    await this.ormRepository.remove(userEpisode);
  }

  async findAll(userId: string): Promise<UserEpisode[]> {
    const userEpisodes = await this.ormRepository.find({
      where: {
        userId,
      },
    });

    return userEpisodes;
  }
}

export default UserEpisodeRepository;
