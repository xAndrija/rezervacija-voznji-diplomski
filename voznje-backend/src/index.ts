import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import reservationRoutes from './routes/reservationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server radi' });
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});