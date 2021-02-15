import { Router } from 'express';
import serieSearchRouter from '@modules/series/infra/http/routes/serie.search.routes';
import episodeSearchRouter from '@modules/episodes/infra/http/routes/episode.search.routes';

const search = Router();
search.use('/serie', serieSearchRouter);
search.use('/episode', episodeSearchRouter);

export default search;
