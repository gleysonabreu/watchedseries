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
}

export default SeasonRepository;
