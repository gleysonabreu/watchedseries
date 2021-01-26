import ICreateSeasonDTO from '../dtos/ICreateSeasonDTO';
import Season from '../infra/typeorm/entities/Season';

export default interface ISeasonRepository {
  store(season: ICreateSeasonDTO): Promise<Season>;
  delete(season: Season): Promise<void>;
  findById(id: string): Promise<Season | undefined>;
  findAll(): Promise<Season[]>;
  update(season: Season): Promise<Season>;
}
