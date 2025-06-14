import './koleksiBuku.css';
import "./tambahBuku.css";
import data from '../../../../data.json';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaCirclePlus } from "react-icons/fa6";

const TambahBuku = () => {
    const [form, setForm] = useState({
        judul: "",
        gambar: "",
        penulis: "",
        tahun: "",
        kategori: "",
        kode: "",
        rak: "",
        sinopsis: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // proses submit data buku, misal ke API atau state global
        console.log("Data Buku:", form);
        alert("Buku berhasil ditambahkan!");
        setForm({
            judul: "",
            gambar: "",
            penulis: "",
            tahun: "",
            kategori: "",
            kode: "",
            rak: "",
            sinopsis: "",
        });
    };

    return (
        <form className="form-tambah-buku" onSubmit={handleSubmit}>
            <h3>Tambah Buku</h3>

            <label>Judul Buku</label>
            <input
                type="text"
                name="judul"
                placeholder="isi judul buku"
                value={form.judul}
                onChange={handleChange}
                required
            />

            <label>Gambar</label>
            <input
                type="file"
                name="gambar"
                value={form.image}
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
                required
            />

            <label>Rak Buku</label>
            <input
                type="text"
                name="rak"
                placeholder="isi rak buku"
                value={form.rak}
                onChange={handleChange}
                required
            />

            <label>Sinopsis</label>
            <textarea
                name="sinopsis"
                placeholder="isi sinopsis"
                value={form.sinopsis}
                onChange={handleChange}
                rows="6"
                required
            ></textarea>

            <button type="submit" className="btn-submit">
                Tambah Buku
            </button>
        </form>
    );
};

function KoleksiBuku() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTambahBuku, setShowTambahBuku] = useState(false);
    const [showSynopsis, setShowSynopsis] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const formRef = useRef(null);
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
            header: "Gambar Buku",
            accessor: "image",

            render: (row) => (
                <img
                    src={row.image}
                    alt={row.title}
                />
            ),
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
            header: "Total Buku",
            accessor: "BooksTotal",
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

    useEffect(() => {
        const tableDiv = document.getElementById("tableBuku");
        if (showTambahBuku) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            if (tableDiv) {
                tableDiv.style.overflowX = "auto";
            }
        }
        return () => {
            document.body.style.overflow = "auto";
            if (tableDiv) {
                tableDiv.style.overflowX = "auto";
            }
        };
    }, [showTambahBuku]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowTambahBuku(false);
            }
        };
        if (showTambahBuku) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showTambahBuku]);

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='koleksiBuku' className='content' style={{ marginTop: '56px', padding: '20px' }}>
                    <section id="koleksi">
                        <h1>Koleksi Buku Perpustakaan</h1>
                        <div>
                            <input
                                type="text"
                                placeholder="Cari buku berdasarkan judul, penulis, atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className='btnTambahBuku'
                                onClick={() => setShowTambahBuku(prev => !prev)}
                            >
                                <FaCirclePlus className="icon" /> Tambah Buku
                            </button>
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
                            {sortConfig.key && (
                                <span style={{ marginLeft: '10px' }}>
                                    | Diurutkan berdasarkan: {
                                        sortConfig.key === 'title' ? 'Judul Buku' :
                                            sortConfig.key === 'author' ? 'Penulis' :
                                                sortConfig.key === 'year' ? 'Tahun' :
                                                    sortConfig.key === 'category' ? 'Kategori' :
                                                        sortConfig.key === 'available' ? 'Status' : sortConfig.key
                                    } ({sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'})
                                </span>
                            )}
                        </div>
                    </section>
                    {showTambahBuku && (
                        <div className="overlayTambahBuku">
                            <div id="formTambahBuku" ref={formRef} className="contentTambahBuku">
                                <TambahBuku />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default KoleksiBuku;