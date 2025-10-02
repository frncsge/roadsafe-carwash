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
      maxAge: 1000 * 60 * 60 * 24,
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
        .json({ success: true, message: "Login successful." }); //passing admin is not needed here
    });
  })(req, res, next);
});

app.get("/api/auth/validation", (req, res) => {
  if (req.isAuthenticated()) {
    return res.sendStatus(200);
  }
  res.sendStatus(401);
});

//for giving the credentials of the logged in user/admin.
app.get("/api/admin/me", (req, res) => {
  if (req.isAuthenticated()) {
    //return the admin through req.user (from the deserializeUser)
    return res.json(req.user);
  }
  res.sendStatus(401);
});

app.get("/api/staff", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const response = await db.query(`SELECT 
	                                      staff_id,
	                                      CONCAT(last_name, ', ', first_name) AS full_name, 
	                                      phone_number,
	                                      status
                                       FROM 
	                                      staff
                                       ORDER BY full_name`);
      const staff = response.rows;
      res.status(200).json(staff);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
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
