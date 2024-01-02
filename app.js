const express = require("express");
const bodyParser = require("body-parser");
const db = require("./scripts/db");
const path = require("path");
const app = express();
const port = 3000;
const session = require("express-session");
const adminOperations = require("./scripts/AdminOperations");
const userFormsHandlers = require('./scripts/UserFormsHandlers');


app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("styles"));
app.use(express.static("views"));
app.use(express.static("Images"));
app.use(express.static('scripts'))

const checkAuthentication = (req, res, next) => {
  if (req.session && req.session.loggedin) {
    return next();
  } else {
    res.redirect("/login");
  }
};
app.get("/", (req, res) => {

  if (req.session && req.session.loggedin) {
    const MainPageLoggedInPath = path.join(__dirname, "views", "MainPageLoggedIn.html");
    res.sendFile(MainPageLoggedInPath);
  } else {
    const MainPagePath = path.join(__dirname, "views", "MainPage.html");
    res.sendFile(MainPagePath);
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Błąd podczas wylogowywania:", err);
      res.send("Błąd podczas wylogowywania");
    } else {
      res.redirect("/");
    }
  });
});
app.get("/login", (req, res) => {
  const loginPath = path.join(__dirname, "views", "LoginPanel.html");
  res.sendFile(loginPath);
});
app.get("/UserPanel", checkAuthentication, (req, res) => {
  const UserPanelPath = path.join(__dirname, "views", "UserPanel.html");
  res.sendFile(UserPanelPath);
});
app.get("/AdminPanel", checkAuthentication, (req, res) => {
  const AdminPanelPath = path.join(__dirname, "views", "AdminPanel.html");
  res.sendFile(AdminPanelPath);
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let role;
  db.query(
    "SELECT * FROM users WHERE Email = ? AND Password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Błąd zapytania SQL:", err);
        res.send("Błąd podczas logowania");
      } else {
        if (results.length > 0) {
          role = results[0].Role;

          req.session.loggedin = true;
          req.session.email = email;
          req.session.userId = results[0].User_id;

          if (role == "admin") {
            res.redirect("/AdminPanel");
          } else {
            res.redirect("/UserPanel");
          }
            
        } else {
         // res.send("Nieprawidłowe dane logowania");
         const loginPath = path.join(__dirname, "views", "LoginPanel.html");
         res.sendFile(loginPath, { loginError: "Nieprawidłowe dane logowania" });
        }
      }
    }
  );
});

app.get("/register", (req, res) => {
  const registerPath = path.join(__dirname, "views", "RegistrationPanel.html");
  res.sendFile(registerPath);
});
app.post("/register", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const acceptRules = req.body.acceptRules;
  const role = "user";

  if (password !== confirmPassword) {
    return res.send("Hasła nie są identyczne");
  }

  if (!acceptRules) {
    return res.send("Musisz zaakceptować regulamin");
  }

  db.query(
    "INSERT INTO users (First_Name, Last_Name, Email, Password, Role) VALUES (?, ?, ?, ?,?)",
    [firstName, lastName, email, password, role],
    (err, results) => {
      if (err) {
        console.error("Błąd zapytania SQL:", err);
        res.send("Błąd podczas rejestracji");
      } else {
        res.send("Rejestracja pomyślna!");
      }
    }
  );
});
app.post("/addBook", adminOperations.addBook);
app.post("/deleteBook", adminOperations.deleteBook);
app.post("/addUser", adminOperations.addUser);
app.post("/deleteUser", adminOperations.deleteUser);

app.post("/rentBook", userFormsHandlers.rentBook);
app.post("/returnBook", userFormsHandlers.returnBook);
app.post('/extendRent',userFormsHandlers.extendRent);

app.get('/getRentals', checkAuthentication, (req, res) => {
  db.query(
    "SELECT books.Title, books.Author, loans.Loan_Date, loans.Return_Date FROM books JOIN loans ON books.Book_id = loans.Book_id WHERE loans.User_id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ success: false, message: "Error fetching rentals" });
      } else {
        const rentals = results.map(result => ({
          Title: result.Title,
          Author: result.Author,
          Loan_Date: result.Loan_Date,
          Return_Date: result.Return_Date
        }));
        res.json({ success: true, books: rentals });
      }
    }
  );
});

app.get("/getBooks", (req, res) => {
  db.query("SELECT Title, Author FROM books", (err, results) => {
    if (err) {
      console.error("Błąd zapytania SQL:", err);
      res.status(500).json({ error: "Błąd podczas pobierania książek" });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
