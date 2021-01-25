import { getRepository, Repository } from 'typeorm';
import ISeasonRepository from '@modules/seasons/repositories/ISeasonRepository';
import ICreateSeasonDTO from '@modules/seasons/dtos/ICreateSeasonDTO';
import Season from '../entities/Season';

class SeasonRepository implements ISeasonRepository {
  private ormRepository: Repository<Season>;

  constructor() {
    this.ormRepository = getRepository(Season);
  }

  public async store(season: ICreateSeasonDTO): Promise<Season> {
    const createSeason = this.ormRepository.create(season);
    const seasonCreated = await this.ormRepository.save(createSeason);
    return seasonCreated;
  }

  public async delete(season: Season): Promise<void> {
    await this.ormRepository.remove(season);
  }

  public async findById(id: string): Promise<Season | undefined> {
    const serie = await this.ormRepository.findOne(id);
    return serie;
  }
}

export default SeasonRepository;
