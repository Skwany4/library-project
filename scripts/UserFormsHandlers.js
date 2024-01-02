const db = require("./db");

function rentBook() {

    db.query("SELECT title FROM books"),(err, results) => {}
}