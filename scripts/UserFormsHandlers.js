const db = require("./db");

function rentBook(req, res) {
  const userId = req.session.userId;
  const bookTitle = req.body.bookTitle;
  const author = req.body.author;
  const rentDate = req.body.rentDate;
  const returnDate = req.body.returnDate;

  db.query(
    "SELECT Book_id FROM books WHERE Title = ? AND Author = ? AND Available_Copies > 0 LIMIT 1",
    [bookTitle, author],
    (bookErr, bookResults) => {
      if (bookErr) {
        console.error("Error getting book ID:", bookErr);
        res.send("Error renting book");
        return;
      }

      if (bookResults.length === 0) {
        console.error("Book not found or no available copies");
        res.send("Error renting book");
        return;
      }
      const bookId = bookResults[0].Book_id;
      console.log("Book ID:", bookId);

      db.query(
        "INSERT INTO loans (User_id, Book_id, Loan_Date, Return_Date) VALUES (?, ?, ?, ?)",
        [userId, bookId, rentDate, returnDate],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error("Error inserting into loans:", insertErr);
            res.send("Error renting book");
          } else {
            console.log("Loan added successfully!");

            db.query(
              "UPDATE books SET Available_Copies = Available_Copies - 1 WHERE Book_id = ?",
              [bookId],
              (updateErr, updateResults) => {
                if (updateErr) {
                  console.error("Error updating book availability:", updateErr);
                  res.send("Error updating book availability");
                } else {
                  console.log("Book availability updated successfully!");
                  res.send("Book rented successfully!");
                }
              }
            );
          }
        }
      );
    }
  );
}
function returnBook(req, res) {
  const userId = req.session.userId;
  const returnedBookTitle = req.body.returnedBookTitle;

  db.query(
    "SELECT loans.Loan_id, books.Book_id FROM loans JOIN books ON loans.Book_id = books.Book_id WHERE loans.User_id = ? AND books.Title = ?",
    [userId, returnedBookTitle],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error getting loan and book ID:", selectErr);
        res.send("Error returning book");
        return;
      }

      if (selectResults.length === 0) {
        console.error("No active loan found for the specified book", { userId, returnedBookTitle, Loan_id: null });
        res.send("No active loan found for the specified book");
        return;
      }

      const loanId = selectResults[0].Loan_id;
      const bookId = selectResults[0].Book_id;

      db.query(
        "DELETE FROM loans WHERE Loan_id = ?",
        [loanId],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            console.error("Error deleting record from loans:", deleteErr);
            res.send("Error returning book");
          } else {
            db.query(
              "UPDATE books SET Available_Copies = Available_Copies + 1 WHERE Book_id = ?",
              [bookId],
              (updateBookErr, updateBookResults) => {
                if (updateBookErr) {
                  console.error("Error updating book availability:", updateBookErr);
                  res.send("Error updating book availability");
                } else {
                  res.send("Book returned successfully!");
                }
              }
            );
          }
        }
      );
    }
  );
}
function extendRent(req, res) {
  const userId = req.session.userId;
  const bookTitleToExtend = req.body.bookTitle;
  const previousReturnDate = req.body.previousReturnDate;
  const newReturnDate = req.body.newReturnDate;

  db.query(
    "SELECT loans.Loan_id, books.Book_id FROM loans JOIN books ON loans.Book_id = books.Book_id WHERE loans.User_id = ? AND LOWER(books.Title) = LOWER(?) AND loans.Return_Date = ?",
    [userId, bookTitleToExtend, previousReturnDate],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error getting loan and book ID:", selectErr);
        res.send("Error extending book loan");
        return;
      }

      if (selectResults.length === 0) {
        console.error("No active loan found for the specified book to extend", { userId, bookTitleToExtend, previousReturnDate, Loan_id: null });
        res.send("No active loan found for the specified book to extend");
        return;
      }

      const loanIdToExtend = selectResults[0].Loan_id;
      // Zakładam, że przedłużenie wypożyczenia oznacza jedynie aktualizację daty zwrotu
      db.query(
        "UPDATE loans SET Return_Date = ? WHERE Loan_id = ?",
        [newReturnDate, loanIdToExtend],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Error updating return date in loans:", updateErr);
            res.send("Error extending book loan");
          } else {
            res.send("Book loan extended successfully!");
          }
        }
      );
    }
  );
}

module.exports = {
  rentBook,
  returnBook,
  extendRent,
};