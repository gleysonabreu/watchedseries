import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import AppError from '@shared/errors/AppError';
import Season from '../infra/typeorm/entities/Season';
import ISeasonRepository from '../repositories/ISeasonRepository';

interface IRequest {
  name: string;
  serieId: string;
}

@injectable()
class CreateSeasonService {
  constructor(
    @inject('SeasonRepository')
    private seasonRepository: ISeasonRepository,
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({ name, serieId }: IRequest): Promise<Season> {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(1),
      serieId: Yup.string().uuid().required(),
    });
    await schema.validate({ name, serieId }, { abortEarly: false });

    const serie = await this.serieRepository.findById(serieId);
    if (!serie) throw new AppError('This serie does not exist');

    const season = await this.seasonRepository.store({ name, serieId });
    return season;
  }
}

export default CreateSeasonService;
