import { Router } from 'express';
import serieRouter from '@modules/series/infra/http/routes/serie.routes';
import seasonRouter from '@modules/seasons/infra/http/routes/season.routes';
import episodeRouter from '@modules/episodes/infra/http/routes/episode.routes';
import userRouter from '@modules/users/infra/http/routes/user.routes';
import authRouter from '@modules/users/infra/http/routes/auth.routes';
import userSerieRouter from '@modules/users/infra/http/routes/userSerie.routes';
import userEpisodeRouter from '@modules/users/infra/http/routes/userEpisode.routes';
import search from './search.routes';

const routes = Router();
routes.use('/serie', serieRouter);
routes.use('/season', seasonRouter);
routes.use('/episode', episodeRouter);
routes.use('/user/serie', userSerieRouter);
routes.use('/user/episode', userEpisodeRouter);
routes.use('/user', userRouter);
routes.use('/auth', authRouter);
routes.use('/search', search);

export default routes;
