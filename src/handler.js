const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const id = nanoid(16);
  let finished = false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (readPage == pageCount) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((books) => books.id == id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooks = (req, h) => {
  const { reading, finished, name } = req.query;

  let filteredBooks = books;

  // filter by reading
  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // filter by finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished,
    );
  }

  // filter by name (case-insensitive)
  if (name !== undefined) {
    const nameLower = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(nameLower),
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBooksById = (req, h) => {
  const { id } = req.params;

  const book = books.filter((b) => b.id === id)[0];

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: book,
    },
  });
  response.code(200);
  return response;
};

const updateBook = (req, h) => {
  const { id } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  let finished = false;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (readPage == pageCount) {
    finished = true;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getAllReadingBooks = (req, h) => {
  const { reading } = req.query;

  if (reading == '1') {
    const readingBooks = books
      .filter((book) => book.reading == true)
      .map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
          reading: book.reading,
        };
      });
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan buku yang sudah dibaca',
      data: {
        book: readingBooks,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'belum ada buku yang dibaca',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooks,
  getBooksById,
  updateBook,
  deleteBook,
  getAllReadingBooks,
};
