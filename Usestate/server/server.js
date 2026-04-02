const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


// Database connection
const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5438/postgres",
  {
    logging: console.log, // shows SQL queries (optional)
  }
);


// Model definition
const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
    underscored: true,
  }
);


// DB init
const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // dev only
    // await sequelize.sync({ force: true });

    console.log("Database connected & synced");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

initDB();


// Routes
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { text, completed = false } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const todo = await Todo.create({ text, completed });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TODO (edit / complete)
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.update({
      text: text ?? todo.text,
      completed: completed ?? todo.completed,
    });

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.destroy();
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
