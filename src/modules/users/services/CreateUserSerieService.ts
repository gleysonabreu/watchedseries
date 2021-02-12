import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import ISerieRepository from '@modules/series/repositories/ISerieRepository';
import AppError from '@shared/errors/AppError';
import IUserSerieRepository from '../repositories/IUserSerieRepository';
import UserSerie from '../infra/typeorm/entities/UserSerie';

interface IRequest {
  serieId: string;
  userId: string;
}

@injectable()
class CreateUserSerieService {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({ serieId, userId }: IRequest): Promise<UserSerie> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      serieId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId, serieId }, { abortEarly: false });

    const serie = await this.serieRepository.findById(serieId);
    if (!serie) throw new AppError('This serie does not exist');

    const userSerie = await this.userSerieRepository.store({ userId, serieId });
    return userSerie;
  }
}

export default CreateUserSerieService;
