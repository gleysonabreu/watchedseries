import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Serie from '../infra/typeorm/entities/Serie';
import ISerieRepository from '../repositories/ISerieRepository';

interface IRequest {
  page: number;
  perPage: number;
}

interface IResponse {
  series: Serie[];
  totalCount: number;
}

@injectable()
class FindAllSeriesService {
  constructor(
    @inject('SerieRepository')
    private serieRepository: ISerieRepository,
  ) {}

  public async execute({ page, perPage }: IRequest): Promise<IResponse> {
    const schema = Yup.object().shape({
      page: Yup.number().required(),
      perPage: Yup.number(),
    });
    await schema.validate({ page }, { abortEarly: false });

    const take = perPage || Number(process.env.WATCHEDSERIES_POST_PER_PAGE);
    const skip = (page - 1) * take;
    const totalCount = (await this.serieRepository.findAll()).length;

    const series = await this.serieRepository.findAll(skip, take);
    return { series, totalCount };
  }
}

export default FindAllSeriesService;
