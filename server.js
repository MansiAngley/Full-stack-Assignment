const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "virtual_scroll",
});

app.get("/api/data", (req, res) => {
  const limit = 100; // Number of records per page
  const cursor = req.query.cursor || 0;

  db.query(
    `SELECT * FROM data WHERE id > ? ORDER BY id ASC LIMIT ?`,
    [cursor, limit],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const nextCursor = results.length ? results[results.length - 1].id : null;
      res.json({ items: results, nextCursor });
    }
  );
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
