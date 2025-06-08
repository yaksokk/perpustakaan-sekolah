import './koleksiBuku.css';
import data from '../../../../data.json';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

function KoleksiBuku() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSynopsis, setShowSynopsis] = useState(null);
    
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const synopsisRef = useRef(null);

    const books = data.buku;
    const originalData = useMemo(() => [...books], [books]);

    // Generic sorting function
    const sortData = useCallback((data, key, direction) => {
        if (!key || !direction) return data;

        return [...data].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // Handle status sorting
            if (key === 'available') {
                aValue = a.available ? 'Tersedia' : 'Dipinjam';
                bValue = b.available ? 'Tersedia' : 'Dipinjam';
            }

            // Handle numeric values (year)
            if (key === 'year') {
                aValue = parseInt(aValue) || 0;
                bValue = parseInt(bValue) || 0;
            }

            // Handle string values
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, []);

    // Handle sorting with 3-stage cycle
    const handleSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key !== key) {
                // New column, start with ascending
                return { key, direction: 'asc' };
            } else if (prevConfig.direction === 'asc') {
                // Same column, ascending -> descending
                return { key, direction: 'desc' };
            } else if (prevConfig.direction === 'desc') {
                // Same column, descending -> reset
                return { key: null, direction: null };
            }
            // Should not reach here, but fallback to ascending
            return { key, direction: 'asc' };
        });
    }, []);

    // Get sort icon
    const getSortIcon = useCallback((columnKey) => {
        if (sortConfig.key === columnKey) {
            if (sortConfig.direction === 'asc') return ' ↑';
            if (sortConfig.direction === 'desc') return ' ↓';
        }
        return ' ↕';
    }, [sortConfig]);

    // Filter and sort data
    const processedBooks = useMemo(() => {
        const filtered = originalData.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return sortData(filtered, sortConfig.key, sortConfig.direction);
    }, [originalData, searchTerm, sortConfig, sortData]);

    const columns = [
        { header: "No", render: (_, idx) => idx + 1 },
        { 
            header: "Judul Buku", 
            accessor: "title",
            sortable: true,
            onClick: () => handleSort('title'),
            sortIcon: getSortIcon('title')
        },
        { 
            header: "Penulis", 
            accessor: "author",
            sortable: true,
            onClick: () => handleSort('author'),
            sortIcon: getSortIcon('author')
        },
        { 
            header: "Tahun", 
            accessor: "year",
            sortable: true,
            onClick: () => handleSort('year'),
            sortIcon: getSortIcon('year')
        },
        { header: "Kode Buku", accessor: "code" },
        { header: "Rak Buku", accessor: "rack" },
        { 
            header: "Kategori", 
            accessor: "category",
            sortable: true,
            onClick: () => handleSort('category'),
            sortIcon: getSortIcon('category')
        },
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
            sortable: true,
            onClick: () => handleSort('available'),
            sortIcon: getSortIcon('available'),
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
                            <Table columns={columns} data={processedBooks} />
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
                            Menampilkan {processedBooks.length} dari {books.length} buku
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default KoleksiBuku;
