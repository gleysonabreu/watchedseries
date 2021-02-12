import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IUserSerieRepository from '../repositories/IUserSerieRepository';

interface IRequest {
  userId: string;
  serieId: string;
}

@injectable()
class DeleteUserSerieService {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,
  ) {}

  public async execute({ userId, serieId }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      serieId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId, serieId }, { abortEarly: false });

    const userSerie = await this.userSerieRepository.findByUserIdAndSerieId(
      userId,
      serieId,
    );
    if (!userSerie)
      throw new AppError('This series was not found in your gallery');

    await this.userSerieRepository.delete(userSerie);
  }
}

export default DeleteUserSerieService;
