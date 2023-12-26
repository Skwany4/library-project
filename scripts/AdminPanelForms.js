  function showAddBook() {
    clearContent();
    document.getElementById('content-container').innerHTML = 
    `
        <div class="AdminForms" id="addBook">
        <h2>Add book to database</h2>
        <form action="/addBook" method="POST">
         <input type="text" name="title" placeholder="Title"><br>
            <input type="text" name="author" placeholder="Author"><br>
            <input type="text" name="Copies" placeholder="Available_Copies"><br>
            <button type="submit">Add book</button>
        </form>
    </div>
    `
  }
  function showDeleteBook() {
    clearContent();
    document.getElementById('content-container').innerHTML = 
    `<div class="AdminForms" id="deleteBook">
    <h2>Delete book from database</h2>
    <form action="/deleteBook" method="POST">
        <input type="text" name="title" placeholder="Title"><br>
        <input type="text" name="author" placeholder="Author"><br>
        <button type="submit">Delete</button>
    </form>
</div>
    `
  }
  
  function showAddUser() {
    clearContent();
    document.getElementById('content-container').innerHTML = `
    <div class="AdminForms" id="addUser">
        <h2>Add user to database</h2>
        <form action="/addUser" method="POST">
            <input type="text" name="First_Name" placeholder="First_Name"><br>
            <input type="text" name="Last_Name" placeholder="Last_Name"><br>
            <input type="text" name="Email" placeholder="Email"><br>
            <input type="text" name="Password" placeholder="Password"><br>
            <input type="text" name="Role" placeholder="Role"><br>
            <button type="submit">Add user</button>
        </form>
    </div>
  `;
  }
function showDeleteUser(){
    clearContent();
    document.getElementById('content-container').innerHTML = `
       <div class="AdminForms" id="deleteUser">
        <h2>Usuń użytkownika z bazy danych</h2>
        <form action="/deleteUser" method="POST">
            <input type="text" name="First_Name" placeholder="First_Name"><br>
            <input type="text" name="Last_Name" placeholder="Last_Name"><br>
            <input type="text" name="Email" placeholder="Email"><br>
            <button type="submit">Delete user</button>
        </form>
    </div>`
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