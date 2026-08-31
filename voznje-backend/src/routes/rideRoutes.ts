import { Router } from 'express';
import { kreirajVoznju, pregledajVoznje, pregledajVoznju, mojeVoznjeKaoVozac, obrisiVoznju, otkaziVoznju } from '../controllers/rideController';
import { proveriToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', pregledajVoznje);
router.get('/moje-voznje', proveriToken, mojeVoznjeKaoVozac);
router.get('/:id', pregledajVoznju);
router.post('/', proveriToken, kreirajVoznju);
router.delete('/:id', proveriToken, obrisiVoznju);
router.patch('/:id/otkazi', proveriToken, otkaziVoznju);

export default router;