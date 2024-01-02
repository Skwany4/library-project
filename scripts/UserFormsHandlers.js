const db = require("./db");

function rentBook(req, res) {
  const userId = req.session.userId;
  const bookTitle = req.body.bookTitle;
  const author = req.body.author;
  const rentDate = req.body.rentDate;
  const returnDate = req.body.returnDate;

  console.log("Renting Book - User ID:", userId);
  console.log("Renting Book - Book Title:", bookTitle);
  console.log("Renting Book - Author:", author);
  console.log("Renting Book - Rent Date:", rentDate);
  console.log("Renting Book - Return Date:", returnDate)

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

module.exports = {
  rentBook,
};
