require("dotenv").config();
const db = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//get all currencies

app.get("/AllCurrencies", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM valiutos ");
    res.status(201).json({
      status: "success",
      data: response.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

//Post all currencies

app.post("/PostCurrencies", async (req, res) => {
  try {
    const response = db.query(
      "INSERT INTO valiutos(currency,rate) values($1,$2)",
      [req.body.currency, req.body.rate]
    );
    res.status(200).json({
      status: "success",
    });
  } catch (err) {}
});

//post history

app.post("/PostHistory", async (req, res) => {
  const response = await db.query(
    "INSERT INTO history(from_num,to_cur) values($1,$2)",
    [req.body.from_num, req.body.to_cur]
  );
  res.status(200).json({
    status: "success",
  });
});

//get history
app.get("/GetHistory", async (req, res) => {
  const response = await db.query("SELECT * from history");
  res.status(201).json({
    status: "success",
    data: response.rows,
  });
});
//delete history
app.delete("/DeleteHistory", async (req, res) => {
  const response = await db.query("DELETE FROM history");
  res.status(201).json({
    status: "success",
  });
});
//delete currencies
app.delete("/DeleteCurrencies", async (req, res) => {
  try {
    const response = await db.query("DELETE FROM valiutos");
    res.status(201).json({
      status: "success",
    });
  } catch (err) {}
});

const PORT = 3001;

app.listen(PORT, console.log("app is listening on port:", PORT));
