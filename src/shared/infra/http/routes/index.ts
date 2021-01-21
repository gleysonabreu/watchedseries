import { Router } from 'express';
import serieRouter from '@modules/series/infra/http/routes/serie.routes';

const routes = Router();
routes.use('/serie', serieRouter);

export default routes;
