import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multer';
import checkImageWasSent from '@shared/infra/http/middleware/checkImageWasSent';
import SerieController from '../controllers/SerieController';

const upload = multer(multerConfig);
const serieController = new SerieController();
const serieRouter = Router();

serieRouter.post(
  '/',
  upload.single('image'),
  checkImageWasSent,
  serieController.store,
);
serieRouter.delete('/:id', serieController.delete);
serieRouter.get('/', serieController.index);
serieRouter.get('/:id', serieController.get);

export default serieRouter;
