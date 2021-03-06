import ICreateSerieDTO from '@modules/series/dtos/ICreateSerieDTO';
import ISearchSerieDTO from '@modules/series/dtos/ISearchSerieDTO';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import { getRepository, Repository, Like } from 'typeorm';
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

  public async findAll(skip: number = 0, take: number = 0): Promise<Serie[]> {
    const series = await this.ormRepository.find({
      skip,
      take,
    });
    return series;
  }

  public async update(serie: Serie): Promise<Serie> {
    const updateSerie = await this.ormRepository.save(serie);
    return updateSerie;
  }

  async search({
    title,
    skip = 0,
    take = 0,
  }: ISearchSerieDTO): Promise<Serie[]> {
    const series = await this.ormRepository.find({
      take,
      skip,
      where: {
        title: Like(`%${title}%`),
      },
    });
    return series;
  }
}

export default SerieRepository;
