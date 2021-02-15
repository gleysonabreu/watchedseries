import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  title: string;
  page: number;
  perPage: number;
}

interface IResponse {
  series: Serie[];
  totalSeries: number;
}

@injectable()
class SearchSerieService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  async execute({ title, page, perPage }: IRequest): Promise<IResponse> {
    perPage = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);

    const schema = Yup.object().shape({
      title: Yup.string().required().min(1),
      page: Yup.number().required(),
      perPage: Yup.number().required(),
    });
    await schema.validate({ title, page, perPage }, { abortEarly: false });

    const skip = (page - 1) * perPage;
    const totalSeries = (await this.serieRepository.search({ title })).length;
    const series = await this.serieRepository.search({
      take: perPage,
      skip,
      title,
    });
    return { series, totalSeries };
  }
}

export default SearchSerieService;
