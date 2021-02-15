import ICreateSerieDTO from '../dtos/ICreateSerieDTO';
import ISearchSerieDTO from '../dtos/ISearchSerieDTO';
import Serie from '../infra/typeorm/entities/Serie';

export default interface ISerieRepository {
  store(serie: ICreateSerieDTO): Promise<Serie>;
  findByTitle(title: string): Promise<Serie | undefined>;
  findById(id: string): Promise<Serie | undefined>;
  remove(serie: Serie): Promise<void>;
  findAll(): Promise<Serie[]>;
  update(serie: Serie): Promise<Serie>;
  search(searchSerie: ISearchSerieDTO): Promise<Serie[]>;
}
