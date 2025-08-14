// ✅ koleksiBuku.jsx (CRUD Lengkap dengan Edit dan Delete)
import './koleksiBuku.css';
import './tambahBuku.css';
import { usePage } from '../../../context';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaCirclePlus, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { useAuth } from '../../../context';

const API_URL = 'http://localhost:5000/api/books';

function KoleksiBuku() {
  const { navigateTo } = usePage();
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(null);
  const [books, setBooks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    judul: '', penulis: '', tahun: '', kategori: '', kode: '', rak: '', sinopsis: '', penerbit: '', total: '', status: '', tersedia: ''
  });

  const formRef = useRef(null);
  const synopsisRef = useRef(null);
  const { token } = useAuth();

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal fetch buku:', err);
      setBooks([]);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `${API_URL}/update/${editId}` : `${API_URL}/create`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menyimpan buku');
      }

      alert(result.message || (isEditing ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!'));
      fetchBooks();
      resetForm();
      setIsEditing(false);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (book) => {
    setForm({
      judul: book.judul || '',
      penulis: book.penulis || '',
      tahun: book.tahun || '',
      kategori: book.kategori || '',
      kode: book.kode || '',
      rak: book.rak || '',
      sinopsis: book.sinopsis || '',
      penerbit: book.penerbit || '',
      total: book.total || '',
      status: book.status || '',
      tersedia: book.tersedia || ''
    });
    setIsEditing(true);
    setEditId(book.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus buku ini?')) return;

    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menghapus buku');
      }

      alert(result.message || 'Buku berhasil dihapus!');
      fetchBooks();
    } catch (err) {
      alert('Gagal hapus buku: ' + err.message);
    }
  };

  const handlePinjam = (book) => {
    // Simpan data buku yang akan dipinjam ke localStorage untuk digunakan di halaman peminjaman
    const bookData = {
      id: book.id,
      judul: book.judul,
      penulis: book.penulis,
      kategori: book.kategori
    };
    localStorage.setItem('selectedBook', JSON.stringify(bookData));

    // Navigate ke halaman peminjaman
    navigateTo('btnPeminjaman');
  };

  const resetForm = () => {
    setForm({
      judul: '', penulis: '', tahun: '', kategori: '', kode: '', rak: '', sinopsis: '', penerbit: '', total: '', status: '', tersedia: ''
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setForm({
      judul: '', penulis: '', tahun: '', kategori: '', kode: '', rak: '', sinopsis: '', penerbit: '', total: '', status: '', tersedia: ''
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menentukan status berdasarkan jumlah tersedia
  const getBookStatus = (tersedia) => {
    return tersedia >= 1 ? 'tersedia' : 'tidak_tersedia';
  };

  // Fungsi untuk menentukan apakah buku bisa dipinjam
  const isBookAvailable = (tersedia) => {
    return tersedia >= 1;
  };

  const processedBooks = useMemo(() => {
    const filtered = books.filter((b) =>
      (b?.judul || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b?.penulis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b?.penerbit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b?.kategori || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tambahkan status dinamis dan ketersediaan untuk setiap buku
    const booksWithStatus = filtered.map(book => ({
      ...book,
      status: getBookStatus(book.tersedia),
      available: isBookAvailable(book.tersedia)
    }));

    if (sortConfig.key && sortConfig.direction) {
      return [...booksWithStatus].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return booksWithStatus;
  }, [books, searchTerm, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: null };
    });
  }, []);

  const getSortIcon = useCallback((key) => {
    if (sortConfig.key === key) return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    return ' ↕';
  }, [sortConfig]);

  const columns = [
    { header: 'No', render: (row, index) => index + 1 },
    { header: 'Judul', accessor: 'judul', sortable: true, onClick: () => handleSort('judul'), sortIcon: getSortIcon('judul') },
    { header: 'Penulis', accessor: 'penulis', sortable: true, onClick: () => handleSort('penulis'), sortIcon: getSortIcon('penulis') },
    { header: 'Penerbit', accessor: 'penerbit', sortable: true, onClick: () => handleSort('penerbit'), sortIcon: getSortIcon('penerbit') },
    { header: 'Tahun', accessor: 'tahun', sortable: true, onClick: () => handleSort('tahun'), sortIcon: getSortIcon('tahun') },
    { header: 'Kode', accessor: 'kode' },
    { header: 'Rak', accessor: 'rak' },
    { header: 'Kategori', accessor: 'kategori' },
    { header: 'Sinopsis', render: (row) => <button onClick={() => setShowSynopsis(row.id)}>📖</button> },
    { header: 'Total', accessor: 'total' },
    {
      header: 'Status',
      render: (row) => (
        <span style={{
          color: row.status === 'tersedia' ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {row.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
        </span>
      )
    },
    { header: 'Tersedia', accessor: 'tersedia' },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="aksi-buttons">
          <button
            disabled={!row.available}
            onClick={() => row.available ? handlePinjam(row) : null}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: row.available ? '#007bff' : '#6c757d',
              color: 'white',
              cursor: row.available ? 'pointer' : 'not-allowed'
            }}
          >
            {row.available ? 'Pinjam' : 'Tidak Dapat Dipinjam'}
          </button>
          <button onClick={() => handleEdit(row)}><FaPenToSquare /></button>
          <button onClick={() => handleDelete(row.id)}><FaTrash /></button>
        </div>
      )
    }
  ];

  return (
    <>
      <Navbar onToggleMenu={() => setShowSidebar((prev) => !prev)} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Sidebar isActive={showSidebar} />
        <main id="koleksiBuku" className="content" style={{ marginTop: '56px', padding: '20px' }}>
          <section id="koleksi">
            <h1>Koleksi Buku</h1>
            <div>
              <input
                type="text"
                placeholder="Cari buku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btnTambahBuku" onClick={handleAddNew}>
                <FaCirclePlus className="icon" /> Tambah Buku
              </button>
            </div>
            <div id="tableBuku">
              <Table columns={columns} data={processedBooks} />
            </div>

            {/* Modal Sinopsis */}
            {showSynopsis !== null && (
              <div className="modal-sinopsis-overlay">
                <div className="modal-sinopsis-content" ref={synopsisRef}>
                  <h2>Sinopsis</h2>
                  <p>{books.find((b) => b.id === showSynopsis)?.sinopsis}</p>
                  <button onClick={() => setShowSynopsis(null)}>Tutup</button>
                </div>
              </div>
            )}

            {/* Form Tambah/Edit Buku */}
            {showForm && (
              <div className="overlayTambahBuku">
                <div className="contentTambahBuku" ref={formRef}>
                  <button className="close-button" onClick={resetForm}>×</button>
                  <form className="form-tambah-buku" onSubmit={handleSubmit}>
                    <h3>{isEditing ? 'Edit' : 'Tambah'} Buku</h3>

                    <label>Judul Buku</label>
                    <input
                      type="text"
                      name="judul"
                      placeholder="isi judul buku"
                      value={form.judul}
                      onChange={handleChange}
                      required
                    />

                    <label>Penulis</label>
                    <input
                      type="text"
                      name="penulis"
                      placeholder="isi penulis"
                      value={form.penulis}
                      onChange={handleChange}
                      required
                    />

                    <label>Penerbit</label>
                    <input
                      type="text"
                      name="penerbit"
                      placeholder="isi penerbit"
                      value={form.penerbit}
                      onChange={handleChange}
                    />

                    <label>Tahun Terbit</label>
                    <input
                      type="text"
                      name="tahun"
                      placeholder="isi tahun terbit"
                      value={form.tahun}
                      onChange={handleChange}
                      required
                    />

                    <label>Kategori</label>
                    <input
                      type="text"
                      name="kategori"
                      placeholder="isi kategori"
                      value={form.kategori}
                      onChange={handleChange}
                      required
                    />

                    <label>Kode Buku</label>
                    <input
                      type="text"
                      name="kode"
                      placeholder="isi kode"
                      value={form.kode}
                      onChange={handleChange}
                    />

                    <label>Rak Buku</label>
                    <input
                      type="text"
                      name="rak"
                      placeholder="isi rak buku"
                      value={form.rak}
                      onChange={handleChange}
                    />

                    <label>Total Buku</label>
                    <input
                      type="number"
                      name="total"
                      placeholder="jumlah total buku"
                      value={form.total}
                      onChange={handleChange}
                    />

                    <label>Tersedia</label>
                    <input
                      type="number"
                      name="tersedia"
                      placeholder="jumlah buku tersedia"
                      value={form.tersedia}
                      onChange={handleChange}
                    />

                    <label>Sinopsis</label>
                    <textarea
                      name="sinopsis"
                      placeholder="isi sinopsis"
                      value={form.sinopsis}
                      onChange={handleChange}
                      rows="6"
                    ></textarea>

                    <button type="submit" className="btn-submit">
                      {isEditing ? 'Perbarui' : 'Tambah'} Buku
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default KoleksiBuku;