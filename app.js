const express = require('express');
const bodyParser = require('body-parser');
const db = require('./scripts/db');
const path = require('path');
const app = express();
const port = 3000;
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('styles'));
app.use(express.static('views'));
app.use(express.static('Images'));
//app.use(express.static('scripts'))

const checkAuthentication = (req, res, next) => {
  if (req.session && req.session.loggedin) {
    // Jeśli użytkownik jest zalogowany, przechodzi dalej
    return next();
  } else {
    // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę logowania
    res.redirect('/login');
  }
};
// Obsługa strony logowania
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, 'views', 'LoginPanel.html');
    res.sendFile(loginPath);
  });
app.get('/UserPanel',checkAuthentication, (req, res) => {
    const UserPanelPath = path.join(__dirname, 'views', 'UserPanel.html');
    res.sendFile(UserPanelPath);
  });
  app.get('/AdminPanel',checkAuthentication, (req, res) => {
    const AdminPanelPath = path.join(__dirname, 'views', 'AdminPanel.html');
    res.sendFile(AdminPanelPath);
  });


// Obsługa danych z formularza logowania
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let role;
  db.query('SELECT * FROM users WHERE Email = ? AND Password = ?', [email, password], (err, results) => {
    if (err) {
      console.error('Błąd zapytania SQL:', err);
      res.send('Błąd podczas logowania');
    } else {
      if (results.length > 0) {
        role = results[0].Role;

        req.session.loggedin = true; // Ustaw flagę zalogowania w sesji
        req.session.email = email; // Przechowaj email w sesji (lub inne informacje o użytkowniku)

        if(role == 'admin')
        {
          res.redirect('/AdminPanel');
        }
        else 
        {
          res.redirect('/UserPanel');
        }
       // res.redirect('/UserPanel')
      } else {
        // Nieprawidłowe dane logowania
        res.send('Nieprawidłowe dane logowania');
      }
    }
  });
});

// Obsługa strony rejestracji
app.get('/register', (req, res) => {
    const registerPath = path.join(__dirname, 'views', 'RegistrationPanel.html');
    res.sendFile(registerPath);
  });
// Obsługa danych z formularza rejestracji
app.post('/register', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const acceptRules = req.body.acceptRules;
    const role = 'user';

    if (password !== confirmPassword) {
        return res.send('Hasła nie są identyczne');
      }
    
      // Sprawdź czy checkbox jest zaznaczony
      if (!acceptRules) {
        return res.send('Musisz zaakceptować regulamin');
      }
    
  
    // Tutaj możesz korzystać z obiektu `db` do wykonywania zapytań SQL
    db.query('INSERT INTO users (First_Name, Last_Name, Email, Password, Role) VALUES (?, ?, ?, ?,?)', [firstName, lastName, email, password,role], (err, results) => {
      if (err) {
        console.error('Błąd zapytania SQL:', err);
        res.send('Błąd podczas rejestracji');
      } else {
        // Rejestracja pomyślna
        res.send('Rejestracja pomyślna!');
      }
    });
  });

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});