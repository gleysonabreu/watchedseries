import { Router } from 'express';
import EpisodeController from '../controllers/EpisodeController';

const episodeRouter = Router();
const episodeController = new EpisodeController();

episodeRouter.post('/', episodeController.store);
episodeRouter.delete('/:id', episodeController.delete);

export default episodeRouter;
