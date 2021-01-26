import { Router } from 'express';
import EpisodeController from '../controllers/EpisodeController';

const episodeRouter = Router();
const episodeController = new EpisodeController();

episodeRouter.post('/', episodeController.store);

export default episodeRouter;
