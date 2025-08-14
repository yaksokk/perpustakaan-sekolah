import './koleksiBuku.css';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../../../context';
import { usePage } from '../../../context';

const API_URL = 'http://localhost:5000/api/books';

function KoleksiBuku() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSynopsis, setShowSynopsis] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const synopsisRef = useRef(null);
    const [books, setBooks] = useState([]);

    const { token } = useAuth();
    const { navigateTo } = usePage();

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

    // Fungsi untuk handle tombol pinjam
    const handlePinjamBuku = (bookData) => {
        // Simpan data buku yang dipilih ke localStorage
        localStorage.setItem('selectedBook', JSON.stringify({
            id: bookData.id,
            judul: bookData.judul,
            penulis: bookData.penulis,
            kategori: bookData.kategori
        }));
        
        // Navigasi ke halaman peminjaman
        navigateTo('btnPeminjaman');
    };

    // Generic sorting function
    const processedBooks = useMemo(() => {
        const filtered = books.filter((b) =>
            (b?.judul || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b?.penulis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b?.penerbit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b?.kategori || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key && sortConfig.direction) {
            return [...filtered].sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [books, searchTerm, sortConfig]);

    // Handle sorting with 3-stage cycle
    const handleSort = useCallback((key) => {
        setSortConfig((prev) => {
            if (prev.key !== key) return { key, direction: 'asc' };
            if (prev.direction === 'asc') return { key, direction: 'desc' };
            return { key: null, direction: null };
        });
    }, []);

    // Get sort icon
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
            render: (row) => {
                // Logic: jika tersedia = 0 maka "tidak tersedia", jika tersedia >= 1 maka "tersedia"
                const status = row.tersedia >= 1 ? 'tersedia' : 'tidak tersedia';
                return (
                    <span style={{
                        color: status === 'tersedia' ? '#28a745' : '#dc3545',
                        fontWeight: 'bold'
                    }}>
                        {status}
                    </span>
                );
            }
        },
        { header: 'Tersedia', accessor: 'tersedia' },
        {
            header: "Aksi",
            render: (row) => {
                const isAvailable = row.tersedia >= 1;
                return (
                    <button
                        disabled={!isAvailable}
                        onClick={() => isAvailable && handlePinjamBuku(row)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor: isAvailable ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            cursor: isAvailable ? 'pointer' : 'not-allowed'
                        }}
                    >
                        {isAvailable ? 'Pinjam' : 'Tidak Dapat Dipinjam'}
                    </button>
                );
            }
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (synopsisRef.current && !synopsisRef.current.contains(event.target)) {
                setShowSynopsis(null);
            }
        };
        if (showSynopsis !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSynopsis]);

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='koleksiBukuUser' className='content' style={{ marginTop: '56px', padding: '20px' }}>
                    <section id="koleksi">
                        <h1>Koleksi Buku Perpustakaan User</h1>
                        <div>
                            <input
                                type="text"
                                placeholder="Cari buku berdasarkan judul, penulis, atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div id='tableBukuUser'>
                            <Table columns={columns} data={processedBooks} />
                        </div>
                        {showSynopsis !== null && (
                            <div className="modal-sinopsis-overlay">
                                <div className="modal-sinopsis-content" ref={synopsisRef}>
                                    <h2>Sinopsis</h2>
                                    <p>{books.find(b => b.id === showSynopsis)?.sinopsis}</p>
                                    <button onClick={() => setShowSynopsis(null)}>Tutup</button>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
                            Menampilkan {processedBooks.length} dari {books.length} buku
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default KoleksiBuku;