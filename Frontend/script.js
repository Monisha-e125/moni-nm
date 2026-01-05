const API = 'http://localhost:5000/books';
const form = document.getElementById('bookForm');
const tbody = document.getElementById('bookTbody');
let allBooks = [];

// Load and display books
async function loadBooks() {
  try {
    const response = await fetch(API);
    allBooks = await response.json();
    displayBooks(allBooks);
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:red;">Error loading books</td></tr>';
  }
}

// Display books with +/- buttons
function displayBooks(books) {
  if (books.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#666;">No books. Add first book!</td></tr>';
    return;
  }
  
  tbody.innerHTML = books.map(book => `
    <tr>
      
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.category}</td>
      <td>${book.publishedYear}</td>
      <td>
        ${book.availableCopies}
        <button onclick="updateCopies('${book._id}', 'increase')" class="btn-plus">+</button>
        <button onclick="updateCopies('${book._id}', 'decrease')" class="btn-minus" ${book.availableCopies <= 0 ? 'disabled' : ''}>-</button>
        ${book.availableCopies === 0 ? `<button onclick="deleteBook('${book._id}')" class="btn-delete">🗑️</button>` : ''}
      </td>
    </tr>
  `).join('');
}

// Update copies (+/-)
async function updateCopies(bookId, action) {
  try {
    const response = await fetch(`${API}/${bookId}/${action}`, { method: 'PATCH' });
    const result = await response.json();
    alert(result.message);
    loadBooks();
  } catch (error) {
    alert('Error updating copies');
  }
}

// Delete book (copies = 0 only)
async function deleteBook(bookId) {
  if (confirm('Delete this book?')) {
    try {
      const response = await fetch(`${API}/${bookId}`, { method: 'DELETE' });
      const result = await response.json();
      alert(result.message);
      loadBooks();
    } catch (error) {
      alert('Error deleting book');
    }
  }
}

// Add new book
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookData = {
    
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    category: document.getElementById('category').value,
    publishedYear: parseInt(document.getElementById('year').value),
    availableCopies: parseInt(document.getElementById('copies').value)
  };

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    
    if (response.ok) {
      form.reset();
      loadBooks();
      alert('✅ Book added successfully!');
    } else {
      const error = await response.json();
      alert(error.error || '❌ Error adding book');
    }
  } catch (error) {
    alert('❌ Server error');
  }
});

// Load books on page load
loadBooks();
