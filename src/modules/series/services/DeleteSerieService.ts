import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteSerieService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const serie = await this.serieRepository.findById(id);
    if (!serie) throw new AppError('This series does not exist');

    await this.serieRepository.remove(serie);
  }
}

export default DeleteSerieService;
