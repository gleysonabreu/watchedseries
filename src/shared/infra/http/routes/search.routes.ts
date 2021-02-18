import { Router } from 'express';
import serieSearchRouter from '@modules/series/infra/http/routes/serie.search.routes';
import episodeSearchRouter from '@modules/episodes/infra/http/routes/episode.search.routes';
import useSerieSearchRouter from '@modules/users/infra/http/routes/userSerie.search.routes';

const search = Router();
search.use('/serie', serieSearchRouter);
search.use('/episode', episodeSearchRouter);
search.use('/user/serie', useSerieSearchRouter);

export default search;
