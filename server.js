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

app.get("/api/queue", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const response = await db.query(`SELECT
	q.queue_id,
	cs.customer_id,
	CONCAT(cs.last_name, ', ', cs.first_name) AS customer_name,
	CONCAT(v.make, ', ', v.model) AS customer_vehicle,
	v.type,
	(
		SELECT 
			STRING_AGG(s.service_name, ', ')
		FROM queueService qs
		JOIN service s ON s.service_id = qs.service_id
		WHERE qs.queue_id = q.queue_id
	) AS service_bought,
	(
		SELECT 
			SUM(qs.service_price)
		FROM queueService qs
		WHERE qs.queue_id = q.queue_id
	) AS total_amount,
	q.status,
	(
		SELECT 
			COALESCE(
				STRING_AGG(CONCAT(st.first_name, ' ', st.last_name), '; '), 
				'N/A'
			)
		FROM queueStaff qst
		JOIN staff st ON st.staff_id = qst.staff_id
		WHERE qst.queue_id = q.queue_id
	) AS staff_assigned
FROM queue q
JOIN vehicle v ON v.vehicle_id = q.vehicle_id
JOIN customer cs ON cs.customer_id = v.customer_id
ORDER BY queue_id;`);
      const queue = response.rows;
      res.status(200).json(queue);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

app.get("/api/staff", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const response = await db.query(`SELECT 
	                                        st.staff_id,
	                                        CONCAT(st.last_name, ', ', st.first_name) AS full_name, 
	                                        st.phone_number,
	                                        st.status,
	                                        COALESCE(NULLIF(CONCAT(v.make, ', ', v.model, ' - ', v.plate_number), ',  - '), 'N/A') AS assigned_to
                                       FROM staff st
                                       LEFT JOIN queueStaff qst ON qst.staff_id = st.staff_id
                                       LEFT JOIN queue q ON q.queue_id = qst.queue_id
                                       LEFT JOIN vehicle v ON v.vehicle_id = q.vehicle_id
                                       ORDER BY full_name;`);
      const staff = response.rows;
      res.status(200).json(staff);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
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
