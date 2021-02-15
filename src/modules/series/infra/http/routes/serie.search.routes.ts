import { Router } from 'express';
import SerieController from '../controllers/SerieController';

const serieController = new SerieController();
const serieSearchRouter = Router();

serieSearchRouter.get('/', serieController.search);

export default serieSearchRouter;
