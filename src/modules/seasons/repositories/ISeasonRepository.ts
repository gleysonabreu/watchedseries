import ICreateSeasonDTO from '../dtos/ICreateSeasonDTO';
import Season from '../infra/typeorm/entities/Season';

export default interface ISeasonRepository {
  store(season: ICreateSeasonDTO): Promise<Season>;
}
