import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Season from '../infra/typeorm/entities/Season';
import ISeasonRepository from '../repositories/ISeasonRepository';

interface IRequest {
  name: string;
  id: string;
}

@injectable()
class UpdateSeasonService {
  constructor(
    @inject('SeasonRepository')
    private seasonRepository: ISeasonRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<Season> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      name: Yup.string().required().min(1),
    });
    await schema.validate({ id, name }, { abortEarly: false });

    const season = await this.seasonRepository.findById(id);
    if (!season) throw new AppError('This season does not exist');

    season.name = name;
    const updateSeason = await this.seasonRepository.update(season);
    return updateSeason;
  }
}

export default UpdateSeasonService;
