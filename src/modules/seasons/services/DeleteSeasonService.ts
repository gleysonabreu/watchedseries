import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import ISeasonRepository from '../repositories/ISeasonRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteSerieService {
  constructor(
    @inject('SeasonRepository')
    private seasonRepository: ISeasonRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const season = await this.seasonRepository.findById(id);
    if (!season) throw new AppError('This season does not exist');

    await this.seasonRepository.delete(season);
  }
}

export default DeleteSerieService;
