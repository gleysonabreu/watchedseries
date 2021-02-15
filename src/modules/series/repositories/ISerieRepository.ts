import ICreateSerieDTO from '../dtos/ICreateSerieDTO';
import Serie from '../infra/typeorm/entities/Serie';

export default interface ISerieRepository {
  store(serie: ICreateSerieDTO): Promise<Serie>;
  findByTitle(title: string): Promise<Serie | undefined>;
  findById(id: string): Promise<Serie | undefined>;
  remove(serie: Serie): Promise<void>;
  findAll(skip?: number, take?: number): Promise<Serie[]>;
  update(serie: Serie): Promise<Serie>;
}
