import CreateEpisodeService from '@modules/episodes/services/CreateEpisodeService';
import DeleteEpisodeService from '@modules/episodes/services/DeleteEpisodeService';
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

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteEpisodeService = container.resolve(DeleteEpisodeService);
    await deleteEpisodeService.execute({ id });
    return response.sendStatus(204);
  }
}

export default EpisodeController;
