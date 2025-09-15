// App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [bookList, setBookList] = useState([]);
  const [bookForm, setBookForm] = useState({ title: '', author: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEditingId, setCurrentEditingId] = useState(null);

  // Fetch books initially
  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then(res => res.json())
      .then(data => setBookList(data));
  }, []);

  // Handle form field change
  const handleInputChange = e => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
  };

  // Handle form submission (Add or Update)
  const handleFormSubmit = e => {
    e.preventDefault();

    if (currentEditingId) {
      // Update book
      fetch(`http://localhost:3001/books/${currentEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      })
        .then(res => res.json())
        .then(updatedBook => {
          setBookList(
            bookList.map(book =>
              book.id === currentEditingId ? updatedBook : book
            )
          );
          setCurrentEditingId(null);
          setBookForm({ title: '', author: '' });
        });
    } else {
      // Add new book
      fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      })
        .then(res => res.json())
        .then(newBook => {
          setBookList([...bookList, newBook]);
          setBookForm({ title: '', author: '' });
        });
    }
  };

  // Edit book
  const handleEditBook = selectedBook => {
    setCurrentEditingId(selectedBook.id);
    setBookForm({ title: selectedBook.title, author: selectedBook.author });
  };

  // Delete book
  const handleDeleteBook = bookId => {
    fetch(`http://localhost:3001/books/${bookId}`, {
      method: 'DELETE',
    }).then(() => {
      setBookList(bookList.filter(book => book.id !== bookId));
    });
  };

  // Filter books based on search
  const visibleBooks = bookList.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Library Management</h2>

      {/* Book Form */}
      <form onSubmit={handleFormSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={bookForm.title}
          onChange={handleInputChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={bookForm.author}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {currentEditingId ? 'Update' : 'Add'} Book
        </button>
      </form>

      {/* Search Box */}
      <input
        placeholder="Search by title..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ marginTop: '10px' }}
      />

      {/* Book List */}
      <ul>
        {visibleBooks.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            <button onClick={() => handleEditBook(book)}>Edit</button>
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
