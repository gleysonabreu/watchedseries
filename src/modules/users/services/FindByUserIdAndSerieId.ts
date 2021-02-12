import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import UserSerie from '../infra/typeorm/entities/UserSerie';
import UserEpisode from '../infra/typeorm/entities/UserEpisode';
import IUserEpisodeRepository from '../repositories/IUserEpisodeRepository';
import IUserSerieRepository from '../repositories/IUserSerieRepository';

interface IRequest {
  userId: string;
  serieId: string;
}

interface IResponse {
  userSerie: UserSerie;
  userEpisodes: UserEpisode[];
}

@injectable()
class FindByUserIdAndSerieId {
  constructor(
    @inject('UserSerieRepository')
    private userSerieRepository: IUserSerieRepository,

    @inject('UserEpisodeRepository')
    private userEpisodeRepository: IUserEpisodeRepository,
  ) {}

  public async execute({ userId, serieId }: IRequest): Promise<IResponse> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      serieId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId, serieId }, { abortEarly: false });

    const userSerie = await this.userSerieRepository.findByUserIdAndSerieId(
      userId,
      serieId,
    );
    const userEpisodes = await this.userEpisodeRepository.findAll(userId);
    if (!userSerie) throw new AppError('This series does not exist');

    return { userSerie, userEpisodes };
  }
}

export default FindByUserIdAndSerieId;
