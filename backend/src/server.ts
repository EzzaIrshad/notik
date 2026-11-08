
import { env } from './config/env.js';
import connectDb from './config/db.js';
import app from './app.js';
import logger from './config/logger.js';

connectDb();

app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
})