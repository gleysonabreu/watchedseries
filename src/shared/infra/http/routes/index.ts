import { Router } from 'express';
import serieRouter from '@modules/series/infra/http/routes/serie.routes';
import seasonRouter from '@modules/seasons/infra/http/routes/season.routes';

const routes = Router();
routes.use('/serie', serieRouter);
routes.use('/season', seasonRouter);

export default routes;
