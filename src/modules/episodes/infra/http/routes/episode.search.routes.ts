import { Router } from 'express';
import EpisodeController from '../controllers/EpisodeController';

const episodeSearchRouter = Router();
const episodeController = new EpisodeController();

episodeSearchRouter.get('/', episodeController.search);

export default episodeSearchRouter;
