import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateSerieService from '@modules/series/services/CreateSerieService';
import DeleteSerieService from '@modules/series/services/DeleteSerieService';
import FindAllSeriesService from '@modules/series/services/FindAllSeriesService';
import FindSerieByIdService from '@modules/series/services/FindSerieByIdService';
import UpdateSerieService from '@modules/series/services/UpdateSerieService';
import SearchSerieService from '@modules/series/services/SearchSerieService';
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

  async index(request: Request, response: Response): Promise<Response> {
    const findAllSeriesService = container.resolve(FindAllSeriesService);
    const series = await findAllSeriesService.execute();
    return response.status(200).json(serieView.renderMany(series));
  }

  async get(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findSerieByIdService = container.resolve(FindSerieByIdService);
    const serie = await findSerieByIdService.execute({ id });

    return response.status(200).json(serieView.render(serie));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      title,
      duration,
      status,
      synopsis,
      launch,
      finished,
    } = request.body;
    const { id } = request.params;

    const updateSerieService = container.resolve(UpdateSerieService);
    const updateSerie = await updateSerieService.execute({
      title,
      duration,
      status,
      synopsis,
      launch,
      finished,
      id,
    });

    return response.status(200).json(serieView.render(updateSerie));
  }

  async search(request: Request, response: Response): Promise<Response> {
    const { title } = request.params;
    const { page = 1, perPage } = request.query;

    const searchSerieService = container.resolve(SearchSerieService);
    const { series, totalSeries } = await searchSerieService.execute({
      title: String(title),
      page: Number(page),
      perPage: Number(perPage),
    });

    response.header('X-Total-Count', `${totalSeries}`);
    return response.json(serieView.renderMany(series));
  }
}

export default SerieController;
