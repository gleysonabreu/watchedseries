import ICreateUserSerieDTO from '../dtos/ICreateUserSerieDTO';
import UserSerie from '../infra/typeorm/entities/UserSerie';

export default interface IUserSerieRepository {
  store(userSerie: ICreateUserSerieDTO): Promise<UserSerie>;
  delete(userSerie: UserSerie): Promise<void>;
  findByUserIdAndSerieId(
    userId: string,
    serieId: string,
  ): Promise<UserSerie | undefined>;
  findAll(userId: string, take?: number, skip?: number): Promise<UserSerie[]>;
}
