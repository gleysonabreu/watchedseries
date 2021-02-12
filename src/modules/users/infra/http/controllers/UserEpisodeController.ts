import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserEpisode from '@modules/users/services/CreateUserEpisode';
import DeleteUserEpisodeService from '@modules/users/services/DeleteUserEpisodeService';
import FindAllUserEpisodeService from '@modules/users/services/FindAllUserEpisodeService';
import FindUserEpisodeByIdService from '@modules/users/services/FindUserEpisodeByIdService';

class UserEpisodeController {
  async store(request: Request, response: Response): Promise<Response> {
    const { episodeId } = request.body;
    const { userId } = request;

    const createUserEpisode = container.resolve(CreateUserEpisode);
    const episode = await createUserEpisode.execute({ userId, episodeId });
    return response.json(episode);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id: episodeId } = request.params;
    const { userId } = request;

    const deleteUserEpisodeService = container.resolve(
      DeleteUserEpisodeService,
    );
    await deleteUserEpisodeService.execute({ userId, episodeId });
    return response.sendStatus(204);
  }

  async getAll(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const findAllUserEpisodeService = container.resolve(
      FindAllUserEpisodeService,
    );
    const userEpisodes = await findAllUserEpisodeService.execute({ userId });
    return response.json(userEpisodes);
  }

  async get(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { id: episodeId } = request.params;

    const findUserEpisodeByIdService = container.resolve(
      FindUserEpisodeByIdService,
    );
    const userEpisode = await findUserEpisodeByIdService.execute({
      userId,
      episodeId,
    });
    return response.json(userEpisode);
  }
}

export default UserEpisodeController;
