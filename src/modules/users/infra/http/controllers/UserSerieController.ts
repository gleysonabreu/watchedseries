import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateUserSerieService from '@modules/users/services/CreateUserSerieService';
import DeleteUserSerieService from '@modules/users/services/DeleteUserSerieService';
import FindAllUserSerieService from '@modules/users/services/FindAllUserSerieService';
import FindByUserIdAndSerieId from '@modules/users/services/FindByUserIdAndSerieId';
import userSerieView from '../views/userSerie.view';

class UserSerieController {
  async store(request: Request, response: Response): Promise<Response> {
    const { serieId } = request.body;
    const { userId } = request;

    const createUserSerieService = container.resolve(CreateUserSerieService);
    const resUserSerie = await createUserSerieService.execute({
      serieId,
      userId,
    });
    return response.json(resUserSerie);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id: serieId } = request.params;
    const { userId } = request;

    const deleteUserSerieService = container.resolve(DeleteUserSerieService);
    await deleteUserSerieService.execute({ userId, serieId });
    return response.sendStatus(204);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { page = 1, perPage } = request.query;

    const findAllUserSerie = container.resolve(FindAllUserSerieService);
    const { totalSeries, ...userSeries } = await findAllUserSerie.execute({
      userId,
      page: Number(page),
      perPage: Number(perPage),
    });

    response.header('X-Total-Count', `${totalSeries}`);
    return response.json(userSerieView.renderMany(userSeries));
  }

  async get(request: Request, response: Response): Promise<Response> {
    const { id: serieId } = request.params;
    const { userId } = request;

    const findByUserIdAndSerieId = container.resolve(FindByUserIdAndSerieId);
    const { userSerie, userEpisodes } = await findByUserIdAndSerieId.execute({
      userId,
      serieId,
    });
    return response.json(userSerieView.render({ userSerie, userEpisodes }));
  }
}

export default UserSerieController;
