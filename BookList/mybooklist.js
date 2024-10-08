//Book Class: Represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector("#book-form")
        container.insertBefore(div, form);

        //Vanish after three seconds
        setTimeout(()=>{document.querySelector('.alert').remove();}, 3000);
    }

    static clearFields(){
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}
//Store Class: Handles storage

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')==null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }
    
    static removeBooks(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn == isbn){
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display a book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
document.getElementById("book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    //validate
    if(title=='' || author=='' || isbn==''){
        UI.showAlert("Please fill out the fields", 'danger');
    }
    else{
        const book = new Book(title, author, isbn);
        //Add book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBooks(book);

        
        //Show success message
        UI.showAlert("Book added", 'success');

        //Clear fields
        UI.clearFields();
    }
    
})

//Event: Remove a book
document.querySelector("#book-list").addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    
    //Show success message
    UI.showAlert("Book removed", 'success');
    
    //Remove book
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
})