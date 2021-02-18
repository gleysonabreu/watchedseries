import ICreateUserSerieDTO from '@modules/users/dtos/ICreateUserSerieDTO';
import ISearchUserSerieDTO from '@modules/users/dtos/ISearchUserSerieDTO';
import IUserSerieRepository from '@modules/users/repositories/IUserSerieRepository';
import { getRepository, Repository, Like, WhereExpression } from 'typeorm';
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

  public async findAll(
    userId: string,
    take = 0,
    skip = 0,
  ): Promise<UserSerie[]> {
    const userSeries = await this.ormRepository.find({
      take,
      skip,
      where: {
        userId,
      },
    });
    return userSeries;
  }

  async search({
    title,
    take = 0,
    skip = 0,
    userId,
  }: ISearchUserSerieDTO): Promise<UserSerie[]> {
    const series = await this.ormRepository.find({
      join: { alias: 'userSerie', innerJoin: { serie: 'userSerie.serie' } },
      take,
      skip,
      where: (qb: WhereExpression) => {
        qb.where({
          userId,
        }).andWhere('serie.title LIKE :title', { title: `%${title}%` });
      },
    });

    return series;
  }
}

export default UserSerieRepository;
