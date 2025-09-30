import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";

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
  cors({
    origin: "http://localhost:5173", // my front-end's url
    credentials: true, // allow sending cookies
  })
); //i need to change this before deployment !!!

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.post("/api/admin/login", (req, res, next) => {
  passport.authenticate("local", (error, admin) => {
    if (error)
      return res
        .status(500)
        .json({ success: false, message: "Server error. Try again later." });

    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password." });

    //create the session
    req.logIn(admin, (error) => {
      if (error)
        return res
          .status(500)
          .json({ success: false, message: "Server error. Try again later." });

      return res
        .status(200)
        .json({ success: true, message: "Login successful.", admin });
    });
  })
  
  (req, res, next);
});

app.get("/api/auth/validation", (req, res) => {
  res.json({ isLoggedIn: req.isAuthenticated() }); //sends true or false
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      //get the admin with the same username inputed.
      const result = await db.query("SELECT * FROM admin WHERE username = $1", [
        username,
      ]);

      //check if admin did not get retrieved.
      if (result.rows.length === 0) {
        return done(null, false);
      }

      const admin = result.rows[0];
      const storedHashedPassword = admin.password_hash;

      const isPasswordCorrect = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (!isPasswordCorrect) {
        return done(null, false);
      }

      return done(null, { admin_id: admin.admin_id, admin_name: admin.name });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((admin, done) => {
  return done(null, admin);
});

passport.deserializeUser((admin, done) => {
  return done(null, admin);
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
