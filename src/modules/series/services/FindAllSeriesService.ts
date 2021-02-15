import { inject, injectable } from 'tsyringe';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

@injectable()
class FindAllSeriesService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute(): Promise<Serie[]> {
    const series = await this.serieRepository.findAll();
    return series;
  }
}

export default FindAllSeriesService;
