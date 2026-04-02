import { Router } from "express";
const router = Router();

router.get("/products", (req, res) => {
    res.send("product created.")
})


export default router;