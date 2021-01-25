import { Router } from 'express';
import SeasonController from '../controllers/SeasonController';

const seasonRouter = Router();
const seasonController = new SeasonController();

seasonRouter.post('/', seasonController.store);
seasonRouter.delete('/:id', seasonController.delete);

export default seasonRouter;
