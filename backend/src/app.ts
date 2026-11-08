import express from 'express';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import helmet from "helmet";
import cors from 'cors';

import logger from './config/logger.js';
import userRoute from './routes/auth.route.js'
import noteRoute from './routes/notes.route.js'
import { env } from './config/env.js';

const app = express();
app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.use('/api/auth', userRoute);
app.use('/api/notes', noteRoute);

export default app;