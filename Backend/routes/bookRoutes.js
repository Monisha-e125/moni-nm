const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: '❌ Duplicate ISBN! Book already exists.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PATCH increase copies
router.patch('/:id/increase', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: '❌ Book not found' });
    book.availableCopies += 1;
    await book.save();
    res.json({ message: `✅ Copies increased to ${book.availableCopies}`, book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH decrease copies
router.patch('/:id/decrease', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: '❌ Book not found' });
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: '❌ No copies available' });
    }
    book.availableCopies -= 1;
    await book.save();
    res.json({ message: `✅ Copies decreased to ${book.availableCopies}`, book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH change category
router.patch('/:id/category', async (req, res) => {
  try {
    const { category } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id, { category }, 
      { new: true }
    );
    if (!book) return res.status(404).json({ error: '❌ Book not found' });
    res.json({ message: `✅ Category changed to ${category}`, book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE book (only if copies = 0)
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: '❌ Book not found' });
    if (book.availableCopies > 0) {
      return res.status(400).json({ error: '❌ Cannot delete - copies available' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Book deleted (no copies left)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
