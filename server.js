const express = require("express");
const path = require("path");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user");
const supplierRoutes = require("./routes/supplier");
const productRoutes = require("./routes/product");
const categoriesRoutes = require("./routes/categories");
const orderRoutes = require("./routes/order");

const initializePassport = require("./passportConfig");
initializePassport(passport);

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// API Routes
app.use("/api/inventory/products", productRoutes);
app.use("/api/inventory/suppliers", supplierRoutes);
app.use("/api/inventory/categories", categoriesRoutes);
app.use("/api/inventory/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

// Authentication Routes
app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
});

// Serve the SPA for protected routes
app.get(['/users/dashboard', '/users/products', '/users/orders', '/users/suppliers', '/users/reports'], checkNotAuthenticated, (req, res) => {
    res.render('dashboard'); // Main SPA entry point
});

// Logout route
app.get("/users/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "You have logged out");
        res.redirect("/users/login");
    });
});

// Registration Logic
app.post("/users/register", async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        return res.render("register", { errors });
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 10);
        const userCheck = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (userCheck.rows.length > 0) {
            errors.push({ message: "Email already registered" });
            return res.render("register", { errors });
        } else {
            await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`, [name, email, hashedPassword]);
            req.flash("success_msg", "You are now registered. Please log in");
            res.redirect("/users/login");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Login Logic
app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
}));

// Auth middleware functions
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}

// Redirect to the appropriate page based on authentication status
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/users/dashboard"); // Redirect authenticated users to the dashboard
    } else {
        res.redirect("/users/login"); // Redirect unauthenticated users to the login page
    }
});

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
