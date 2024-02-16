import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import dbConnection from './databases/dbConnection';
import { AppError } from './errors/AppError';
import { globalErrorMiddleware } from './utils/globalErrorMiddleware';
import authRouter from './modules/auth/auth.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import userRouter from './modules/User/user.router';
import { User } from './helper/userInterface'; // Import the User interface from customTypes

dotenv.config();
dbConnection();

const port = process.env.SERVER_PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(hpp());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  '/static',
  express.static(path.join(__dirname, 'backend', 'public', 'uploads'))
);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 404));
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`UnhandledRejection Errors: ${err instanceof Error ? err.message : 'Unknown Error'}`);
    res.status(500).json({ error: 'Internal Server Error', statusCode: 500 });
  });
  
const server = app.listen(port, () => {
  console.log('Server listening on port: ' + port);
});

process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err instanceof Error ? err.message : 'Unknown Error'}`);
  server.close(() => {
    console.error('Shutting down....');
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`uncaughtException Errors: ${err instanceof Error ? err.message : 'Unknown Error'}`);
  server.close(() => {
    console.error('Shutting down....');
    process.exit(1);
  });
});
