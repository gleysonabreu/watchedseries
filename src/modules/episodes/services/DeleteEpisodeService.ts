import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IEpisodeRepository from '../repositories/IEpisodeRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteEpisodeService {
  constructor(
    @inject('EpisodeRepository')
    private episodeRepository: IEpisodeRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const episode = await this.episodeRepository.findById(id);
    if (!episode) throw new AppError('This episode does not exist');

    await this.episodeRepository.delete(episode);
  }
}

export default DeleteEpisodeService;
