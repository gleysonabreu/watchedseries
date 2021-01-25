import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Season from '../infra/typeorm/entities/Season';
import ISeasonRepository from '../repositories/ISeasonRepository';

@injectable()
class FindAllSeasonsService {
  constructor(
    @inject('SeasonRepository')
    private seasonRepository: ISeasonRepository,
  ) {}

  public async execute(): Promise<Season[]> {
    const seasons = await this.seasonRepository.findAll();
    return seasons;
  }
}

export default FindAllSeasonsService;
