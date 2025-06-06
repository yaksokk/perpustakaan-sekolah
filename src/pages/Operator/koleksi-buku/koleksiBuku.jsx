import './koleksiBuku.css';
import "./tambahBuku.css";
import data from '../../../../data.json';
import { Navbar, Sidebar } from '../../../components';
import Table from '../../../components/shared/table/table'
import { useState, useEffect, useRef } from 'react';
import { FaCirclePlus } from "react-icons/fa6";

const TambahBuku = () => {
    const [form, setForm] = useState({
        judul: "",
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
    const formRef = useRef(null);
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

    useEffect(() => {
        const tableDiv = document.getElementById("tableBuku");
        if (showTambahBuku) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            if (tableDiv) {
                tableDiv.style.overflowX = "auto"; // tambahkan scroll horizontal
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
