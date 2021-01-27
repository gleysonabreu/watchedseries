import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateEpisodeService from '@modules/episodes/services/CreateEpisodeService';
import DeleteEpisodeService from '@modules/episodes/services/DeleteEpisodeService';
import FindEpisodeByIdService from '@modules/episodes/services/FindEpisodeByIdService';

import UpdateEpisodeService from '@modules/episodes/services/UpdateEpisodeService';
import episodeView from '../views/episode.view';

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

  async get(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findEpisodeByIdService = container.resolve(FindEpisodeByIdService);
    const episode = await findEpisodeByIdService.execute({ id });
    return response.json(episodeView.render(episode));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { title, synopsis, firstAired } = request.body;

    const updateEpisodeService = container.resolve(UpdateEpisodeService);
    const episode = await updateEpisodeService.execute({
      id,
      title,
      synopsis,
      firstAired,
    });
    return response.json(episode);
  }
}

export default EpisodeController;
