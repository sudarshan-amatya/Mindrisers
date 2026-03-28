import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('order Fetched...');
});
router.post('/', (req, res) => {
  res.send('order create...');
});

export default router;
