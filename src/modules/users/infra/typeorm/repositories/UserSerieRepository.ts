import ICreateUserSerieDTO from '@modules/users/dtos/ICreateUserSerieDTO';
import IUserSerieRepository from '@modules/users/repositories/IUserSerieRepository';
import { getRepository, Repository } from 'typeorm';
import UserSerie from '../entities/UserSerie';

class UserSerieRepository implements IUserSerieRepository {
  private ormRepository: Repository<UserSerie>;

  constructor() {
    this.ormRepository = getRepository(UserSerie);
  }

  public async store(userSerie: ICreateUserSerieDTO): Promise<UserSerie> {
    const createUserSerie = this.ormRepository.create(userSerie);
    const userSerieCreate = this.ormRepository.save(createUserSerie);

    return userSerieCreate;
  }

  public async delete(userSerie: UserSerie): Promise<void> {
    await this.ormRepository.remove(userSerie);
  }

  public async findByUserIdAndSerieId(
    userId: string,
    serieId: string,
  ): Promise<UserSerie | undefined> {
    const userSerie = await this.ormRepository.findOne({
      where: {
        userId,
        serieId,
      },
    });
    return userSerie;
  }

  public async findAll(userId: string): Promise<UserSerie[]> {
    const userSeries = await this.ormRepository.find({ userId });
    return userSeries;
  }
}

export default UserSerieRepository;
