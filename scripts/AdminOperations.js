const db = require("./db");

function addBook(req, res) {
    const title = req.body.title;
    const author = req.body.author;
    const copies = req.body.Copies;
    db.query(
        "INSERT INTO books (Title, Author, Available_Copies) VALUES (?, ?, ?)",
        [title, author, copies],
        (err, results) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                res.send("Error adding book to the database");
            } else {
                res.send("Book added to the database successfully!");
            }
        }
    );
}

function deleteBook(req, res) {
    const title = req.body.title;
    const author = req.body.author;

    db.query(
        "DELETE FROM books WHERE Title = ? AND Author = ?",
        [title, author],
        (err, results) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                res.send("Error deleting book from the database");
            } else {
                res.send("Book deleted from the database successfully!");
            }
        }
    );
}

function addUser(req, res) {
    const firstName = req.body.First_Name;
    const lastName = req.body.Last_Name;
    const email = req.body.Email;
    const password = req.body.Password;
    const role = req.body.Role;

    db.query(
        "INSERT INTO users (First_Name, Last_Name, Email, Password, Role) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, email, password, role],
        (err, results) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                res.send("Error adding user to the database");
            } else {
                res.send("User added to the database successfully!");
            }
        }
    );
}

function deleteUser(req, res) {
    const firstName = req.body.First_Name;
    const lastName = req.body.Last_Name;
    const email = req.body.Email;

    db.query(
        "DELETE FROM users WHERE First_Name = ? AND Last_Name = ? AND Email = ?",
        [firstName, lastName, email],
        (err, results) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                res.send("Error deleting user from the database");
            } else {
                res.send("User deleted from the database successfully!");
            }
        }
    );
}

module.exports = {
    addBook,
    deleteBook,
    addUser,
    deleteUser
};
