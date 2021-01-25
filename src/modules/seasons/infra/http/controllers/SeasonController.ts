import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSeasonService from '@modules/seasons/services/CreateSeasonService';
import DeleteSeasonService from '@modules/seasons/services/DeleteSeasonService';
import seasonView from '../views/season.view';

class SeasonController {
  async store(request: Request, response: Response): Promise<Response> {
    const { name, serieId } = request.body;

    const createSeasonService = container.resolve(CreateSeasonService);
    const season = await createSeasonService.execute({ name, serieId });
    return response.status(200).json(seasonView.render(season));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteSeasonService = container.resolve(DeleteSeasonService);
    await deleteSeasonService.execute({ id });
    return response.sendStatus(204);
  }
}

export default SeasonController;
