import { Router } from 'express';
import { kreirajRezervaciju, otkaziRezervaciju, mojeRezervacije } from '../controllers/reservationController';
import { proveriToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', proveriToken, kreirajRezervaciju);
router.patch('/:id/otkazi', proveriToken, otkaziRezervaciju);
router.get('/moje', proveriToken, mojeRezervacije);

export default router;