import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateSerieService from '@modules/series/services/CreateSerieService';
import DeleteSerieService from '@modules/series/services/DeleteSerieService';
import serieView from '../views/serie.view';

class SerieController {
  async store(request: Request, response: Response): Promise<Response> {
    const {
      title,
      duration,
      launch,
      finished,
      status,
      synopsis,
    } = request.body;
    const { key: image } = request.file;

    const createSerieService = container.resolve(CreateSerieService);
    const serie = await createSerieService.execute({
      title,
      duration,
      launch,
      finished,
      status,
      synopsis,
      image,
    });

    return response.json(serieView.render(serie));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteSerieService = container.resolve(DeleteSerieService);
    await deleteSerieService.execute({ id });

    return response.sendStatus(204);
  }
}

export default SerieController;
