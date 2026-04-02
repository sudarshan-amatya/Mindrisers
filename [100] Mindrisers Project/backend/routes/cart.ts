import { Router } from "express";
import cartController from "../controllers/cart";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth, cartController.getCart);
router.post("/add", requireAuth, cartController.addToCart);
router.patch("/update", requireAuth, cartController.updateQty);
router.delete("/remove/:productId", requireAuth, cartController.removeItem);
router.delete("/clear", requireAuth, cartController.clearCart);

export default router;
