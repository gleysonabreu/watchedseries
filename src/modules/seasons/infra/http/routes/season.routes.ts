import { Router } from 'express';
import SeasonController from '../controllers/SeasonController';

const seasonRouter = Router();
const seasonController = new SeasonController();

seasonRouter.post('/', seasonController.store);
seasonRouter.delete('/:id', seasonController.delete);
seasonRouter.get('/:id', seasonController.get);
seasonRouter.get('/', seasonController.getAll);
seasonRouter.put('/:id', seasonController.update);

export default seasonRouter;
