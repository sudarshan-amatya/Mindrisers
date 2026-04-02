import express from 'express';
import './models'
import routes from './routes';
import sequelize from './connections/database';
import resourceNotFoundHandler from './middlewares/resourceNotFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(errorHandler);
app.use(resourceNotFoundHandler);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected...');
    await sequelize.sync();
    // await sequelize.sync({ alter: true, force: true });
    app.listen(3000, () => console.log('Server listening on 3000...'));
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
}

start();
