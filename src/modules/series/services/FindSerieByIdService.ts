import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindSerieByIdService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Serie> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const findSerie = await this.serieRepository.findById(id);
    if (!findSerie) throw new AppError('This serie does not exist');

    return findSerie;
  }
}

export default FindSerieByIdService;
