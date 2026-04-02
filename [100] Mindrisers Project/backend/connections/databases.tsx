import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "postgres://postgres:postgres@localhost:5436/postgres",
    { logging: false }
);

// export default async function connectDB() {
//     try {
//         await sequelize.authenticate();
//         await sequelize.sync();
//         console.log("Connection has been established successfully.");
//     } catch (error) {
//         console.error("Unable to connect to the database:", error);
//         process.exit(1);
//     }
// }

// iife//
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
})();
