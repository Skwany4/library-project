function showBookCatalog() {
  clearContent();
  // Tutaj możesz dodać kod do wyświetlenia katalogu książek
  document.getElementById('content-container').innerHTML = '<p>Book catalog content goes here.</p>';
}

function showMyRentals() {
  clearContent();
  // Tutaj możesz dodać kod do wyświetlenia listy wypożyczonych książek
  document.getElementById('content-container').innerHTML = '<p>My rentals content goes here.</p>';
}
function showRentForm() {
  clearContent();
  document.getElementById('content-container').innerHTML = 
  `
    <form class="UserForm">
      <label for="bookTitle">Book Title:</label>
      <input type="text" id="bookTitle" name="bookTitle" required> <br>

      <label for="author">Author:</label>
      <input type="text" id="author" name="author" required> <br>

      <label for="RentDate">Select rent date</label>
      <input type="date" id="RentDate" name="RentDate">

      <label for="ReturnDate">Select return date</label>
      <input type="date" id="ReturnDate" name="ReturnDate">

      <button type="submit">Rent</button>
    </form>
  `
}

function showExtendForm() {
  clearContent();
  // Tutaj możesz dodać kod do wyświetlenia formularza do przedłużenia wypożyczenia
  document.getElementById('content-container').innerHTML =  `
  <form class="UserForm">
    <label for="bookTitle">Select book:</label>
    <input type="text" id="bookTitle" name="bookTitle" required> <br>

    <label for="PriviousRentDate">Select privious return date</label>
    <input type="date" id="PriviousRentDate" name="PriviousRentDate">

    <label for="NewReturnDate">Select extend date</label>
    <input type="date" id="NewReturnDate" name="NewReturnDate">

    <button type="submit">Extend</button>
  </form>
`;
}

function showReturnForm() {
  clearContent();
  `
  <form class="UserForm">
    <label for="bookTitle">Select book:</label>
    <input type="text" id="bookTitle" name="bookTitle" required> <br>

    <label for="PriviousRentDate">Select privious return date</label>
    <input type="date" id="PriviousRentDate" name="PriviousRentDate">

    <label for="NewReturnDate">Select extend date</label>
    <input type="date" id="NewReturnDate" name="NewReturnDate">

    <button type="submit">Extend</button>
  </form>
`
  document.getElementById('content-container').innerHTML = '<p>Return book form goes here.</p>';
}

function showLogout() {
  clearContent();
  // Tutaj możesz dodać kod do wylogowania użytkownika
  document.getElementById('content-container').innerHTML = '<p>Logout content goes here.</p>';
}

function clearContent() {
  // Czyszczenie zawartości kontenera przed dodaniem nowej treści
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