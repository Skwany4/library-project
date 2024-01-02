function showBookCatalog() {
  clearContent();
  location.href = "Books.html"
  document.getElementById('content-container').innerHTML = '<p>Book catalog content goes here.</p>';
}

function showMyRentals() {
  clearContent();

  fetch('/getRentals', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const rentals = data.books;
        const rentalsHtml = rentals.map(rental => `
          <p>Title: ${rental.Title}</p>
          <p>Author: ${rental.Author}</p>
          <p>Loan Date: ${rental.Loan_Date}</p>
          <p>Return Date: ${rental.Return_Date}</p>
          <hr>
        `).join('');
        
        document.getElementById('content-container').innerHTML = rentalsHtml;
      } else {
        document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching rentals:', error);
      document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
    });
}
// Zmienna, w której będziemy przechowywać dane o książkach
let booksData;

function showRentForm() {
  clearContent();

  // Tworzenie formularza z pustą listą książek
  document.getElementById('content-container').innerHTML =
    `
    <form class="UserForm" method="POST" action="/rentBook">
      <label for="bookTitle">Book Title:</label>
      <select id="bookTitle" name="bookTitle"></select> <br>

      <label for="author">Author:</label>
      <input type="text" id="author" name="author" required readonly> <br>

      <label for="RentDate">Select rent date</label>
      <input type="date" id="RentDate" name="rentDate">

      <label for="ReturnDate">Select return date</label>
      <input type="date" id="ReturnDate" name="returnDate">

      <button type="submit">Rent</button>
    </form>
  `;

  // Pobieranie danych z serwera (np. tytułów książek) po kliknięciu w pole wyboru
  const booksSelect = document.getElementById('bookTitle');
  booksSelect.addEventListener('click', function() {
    // Sprawdź, czy lista książek jest już załadowana
    if (!booksData) {
      fetch('/getBooks')
        .then(response => response.json())
        .then(data => {
          // Przypisanie danych do zmiennej booksData
          booksData = data;

          // Wypełnienie pola wyboru opcjami (tytułami książek)
          booksData.forEach(book => {
            const option = document.createElement('option');
            option.value = book.Title;
            option.text = book.Title;
            booksSelect.add(option);
          });
        })
        .catch(error => {
          console.error('Błąd podczas pobierania danych z serwera:', error);
        });
    }
  });

  // Dodanie obsługi zdarzenia zmiany wybranego tytułu
  booksSelect.addEventListener('change', function() {
    const selectedTitle = this.value;
    const selectedBook = booksData.find(book => book.Title === selectedTitle);

    // Ustawienie wartości pola "Author" na podstawie wybranego tytułu
    document.getElementById('author').value = selectedBook ? selectedBook.Author : '';
  });
}

function showExtendForm() {
  clearContent();

  fetch('/getRentals', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const rentals = data.books;

        const selectOptions = rentals.map(rental => `
          <option value="${rental.Title}" data-return-date="${rental.Return_Date}">
            ${rental.Title} - ${rental.Author}
          </option>
        `).join('');

        document.getElementById('content-container').innerHTML = `
          <form class="UserForm" method="POST" action="/extendRent">
            <label for="bookTitle">Select book:</label>
            <select id="bookTitle" name="bookTitle" required>
              ${selectOptions}
            </select> <br>

            <label for="previousReturnDate">Select previous return date:</label>
            <input type="date" id="previousReturnDate" name="previousReturnDate" required> <br>

            <label for="newReturnDate">Select extend date:</label>
            <input type="date" id="newReturnDate" name="newReturnDate" required> <br>

            <button type="submit">Extend</button>
          </form>
        `;

        // Ustawienie wartości domyślnej na polu wyboru daty zwrotu
        const bookTitleSelect = document.getElementById('bookTitle');
        const previousReturnDateInput = document.getElementById('previousReturnDate');

        bookTitleSelect.addEventListener('change', function() {
          const selectedOption = bookTitleSelect.options[bookTitleSelect.selectedIndex];
          const returnDate = selectedOption.getAttribute('data-return-date');

          // Ustawienie wartości domyślnej
          previousReturnDateInput.value = returnDate;
        });
      } else {
        document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching rentals:', error);
      document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
    });
}

function showReturnForm() {
  clearContent();

  fetch('/getRentals', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const rentals = data.books;

        const selectOptions = rentals.map(rental => `
          <option value="${rental.Title}">${rental.Title} - ${rental.Author}</option>
        `).join('');

        document.getElementById('content-container').innerHTML = `
          <form class="UserForm" method="POST" action="/returnBook">
            <label for="returnedBookTitle">Select returned book:</label>
            <select id="returnedBookTitle" name="returnedBookTitle" required>
              ${selectOptions}
            </select> <br>

            <button type="submit">Return</button>
          </form>
        `;
      } else {
        document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching rentals:', error);
      document.getElementById('content-container').innerHTML = '<p>Error fetching rentals</p>';
    });
}

function clearContent() {
  document.getElementById('content-container').innerHTML = '';
}
function logout() {
  fetch('/logout', { method: 'GET' })
      .then(response => {
          window.location.href = "/";
      })
      .catch(error => {
          console.error('Błąd podczas wylogowywania:', error);
      });
}
