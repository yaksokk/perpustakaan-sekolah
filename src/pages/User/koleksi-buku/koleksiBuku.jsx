import './koleksiBuku.css';
import data from '../../../../data.json';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table'
import { useState, useEffect, useRef } from 'react';

function KoleksiBuku() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSynopsis, setShowSynopsis] = useState(null);
    const synopsisRef = useRef(null);

    const books = data.buku;
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const columns = [
        { header: "No", render: (_, idx) => idx + 1 },
        { header: "Judul Buku", accessor: "title" },
        { header: "Penulis", accessor: "author" },
        { header: "Tahun", accessor: "year" },
        { header: "Kode Buku", accessor: "code" },
        { header: "Rak Buku", accessor: "rack" },
        { header: "Kategori", accessor: "category" },
        {
            header: "Sinopsis",
            render: (row) => (
                <button
                    onClick={() => setShowSynopsis(row.id)}
                    aria-label="Lihat sinopsis"
                    style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                >📖</button>
            )
        },
        {
            header: "Status",
            render: (row) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: row.available ? '#d4edda' : '#f8d7da',
                    color: row.available ? '#155724' : '#721c24',
                    fontSize: '12px'
                }}>
                    {row.available ? 'Tersedia' : 'Dipinjam'}
                </span>
            )
        },
        {
            header: "Aksi",
            render: (row) => (
                <button
                    disabled={!row.available}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: row.available ? '#007bff' : '#6c757d',
                        color: 'white'
                    }}
                >
                    {row.available ? 'Pinjam' : 'Tidak Dapat Dipinjam'}
                </button>
            )
        }
    ];

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='koleksiBuku' className='content' style={{ marginTop: '56px', padding: '20px' }}>
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
                        <div id='tableBuku'>
                            <Table columns={columns} data={filteredBooks} />
                        </div>
                        {showSynopsis !== null && (
                            <div className="modal-sinopsis-overlay">
                                <div className="modal-sinopsis-content" ref={synopsisRef}>
                                    <h2>Sinopsis</h2>
                                    <p>{books.find(b => b.id === showSynopsis)?.synopsis}</p>
                                    <button onClick={() => setShowSynopsis(null)}>Tutup</button>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
                            Menampilkan {filteredBooks.length} dari {books.length} buku
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default KoleksiBuku;
