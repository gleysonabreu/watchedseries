import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import connection from '@shared/infra/typeorm/connection';
import AppHandleError from '../../errors/AppHandleError';
import routes from './routes';

connection();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(AppHandleError);

export default app;
