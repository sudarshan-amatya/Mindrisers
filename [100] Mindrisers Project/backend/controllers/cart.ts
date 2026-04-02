import { Response } from "express";
import CartItem from "../models/CartItem";
import { AuthedRequest } from "../middlewares/authMiddleware";

const cartController = {
  // GET /cart
  getCart: async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    const items = await CartItem.findAll({ where: { userId }, order: [["id", "DESC"]] });
    res.json(items);
  },

  // POST /cart/add
  addToCart: async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    const { productId, title, price, thumbnail, qty } = req.body;

    if (!productId || !title || !price || !thumbnail || !qty) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await CartItem.findOne({ where: { userId, productId } });

    if (existing) {
      existing.set("qty", Number(existing.get("qty")) + Number(qty));
      await existing.save();
      return res.json(existing);
    }

    const created = await CartItem.create({
      userId,
      productId,
      title,
      price,
      thumbnail,
      qty,
    });

    res.status(201).json(created);
  },

  // PATCH /cart/update
  updateQty: async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    const { productId, qty } = req.body;

    if (!productId || typeof qty !== "number") {
      return res.status(400).json({ message: "Missing productId/qty" });
    }

    const item = await CartItem.findOne({ where: { userId, productId } });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (qty <= 0) {
      await item.destroy();
      return res.json({ message: "Item removed" });
    }

    item.set("qty", qty);
    await item.save();
    res.json(item);
  },

  // DELETE /cart/remove/:productId
  removeItem: async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    const item = await CartItem.findOne({ where: { userId, productId } });
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();
    res.json({ message: "Removed" });
  },

  // DELETE /cart/clear
  clearCart: async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    await CartItem.destroy({ where: { userId } });
    res.json({ message: "Cart cleared" });
  },
};

export default cartController;
