import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();
const port = 3000;
const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
db.connect();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors()); //i need to change this before deployment !!!
app.use(express.json());

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  //get the admin with the same username inputed.
  const result = await db.query("SELECT * FROM admin WHERE username = $1", [
    username,
  ]);
  if (result.rows.length > 0) {
    //check if admin got retrieved.
    const admin = result.rows[0];
    const storedHashedPassword = admin.password_hash;

    bcrypt.compare(password, storedHashedPassword, (err, isPasswordCorrect) => {
      if (err) {
        console.err("Error comparing passwords:", err);
      }

      if (isPasswordCorrect) {
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    });
  } else {
    //if not retrieved, send back invalid message.
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
