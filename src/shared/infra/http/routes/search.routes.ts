import { Router } from 'express';
import serieSearchRouter from '@modules/series/infra/http/routes/serie.search.routes';

const search = Router();
search.use('/serie', serieSearchRouter);

export default search;
