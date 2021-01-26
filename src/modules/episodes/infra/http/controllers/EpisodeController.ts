import CreateEpisodeService from '@modules/episodes/services/CreateEpisodeService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class EpisodeController {
  async store(request: Request, response: Response): Promise<Response> {
    const { title, seasonId, firstAired, synopsis } = request.body;

    const createEpisodeService = container.resolve(CreateEpisodeService);
    const episode = await createEpisodeService.execute({
      title,
      seasonId,
      firstAired,
      synopsis,
    });
    return response.json(episode);
  }
}

export default EpisodeController;
