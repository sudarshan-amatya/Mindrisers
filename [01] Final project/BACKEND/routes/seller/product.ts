import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send('Product Fetched...');
});
router.post('/', (req, res) => {
  res.send('Product create...');
});

export default router;
