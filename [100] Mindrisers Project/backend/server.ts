import dotenv from "dotenv";
import express from "express"
import authRoutes from "./routes/index"
import "./connections/databases";
import cors from "cors";
import cartRoutes from "./routes/cart";



dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(authRoutes);
app.use("/cart", cartRoutes);
app.get("/", (req, res) => {
    res.send("Welcome");
})
app.listen(4000, () => {
    console.log("server started");
});