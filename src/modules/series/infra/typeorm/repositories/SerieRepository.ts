import ICreateSerieDTO from '@modules/series/dtos/ICreateSerieDTO';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import { getRepository, Repository } from 'typeorm';
import Serie from '../entities/Serie';

class SerieRepository implements ISerieRepository {
  private ormRepository: Repository<Serie>;

  constructor() {
    this.ormRepository = getRepository(Serie);
  }

  public async store(dataSerie: ICreateSerieDTO): Promise<Serie> {
    const serie = this.ormRepository.create(dataSerie);
    await this.ormRepository.save(serie);

    return serie;
  }

  public async findByTitle(title: string): Promise<Serie | undefined> {
    const serie = await this.ormRepository.findOne({ title });
    return serie;
  }

  public async findById(id: string): Promise<Serie | undefined> {
    const serie = await this.ormRepository.findOne({ id });
    return serie;
  }

  public async remove(serie: Serie): Promise<void> {
    await this.ormRepository.remove(serie);
  }
}

export default SerieRepository;
