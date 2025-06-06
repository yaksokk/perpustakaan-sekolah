import './peminjaman.css'
import { Navbar, Sidebar } from '../../../components';
import { useState } from 'react';

function Peminjaman() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [formData, setFormData] = useState({
        status: '',
        namaPeminjam: '',
        tanggalPinjam: '',
        tanggalKembali: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSimpan = () => {
        // Validasi form
        if (!formData.status || !formData.namaPeminjam || !formData.tanggalPinjam || !formData.tanggalKembali) {
            alert('Harap lengkapi semua field!');
            return;
        }

        // Validasi tanggal
        const tanggalPinjam = new Date(formData.tanggalPinjam);
        const tanggalKembali = new Date(formData.tanggalKembali);

        if (tanggalKembali <= tanggalPinjam) {
            alert('Tanggal pengembalian harus setelah tanggal peminjaman!');
            return;
        }

        console.log('Data peminjaman disimpan:', formData);

        // Implementasi API call untuk menyimpan data
        // fetch('/api/peminjaman', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        alert('Data peminjaman berhasil disimpan!');

        // Reset form setelah berhasil simpan
        setFormData({
            status: '',
            namaPeminjam: '',
            tanggalPinjam: '',
            tanggalKembali: ''
        });
    };

    const handleBatal = () => {
        setFormData({
            status: '',
            namaPeminjam: '',
            tanggalPinjam: '',
            tanggalKembali: ''
        });
        console.log('Form peminjaman dibatalkan');
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='peminjamanBuku' className='content'>
                    <section id="peminjaman">
                        <h1>PEMINJAMAN BUKU</h1>
                        <div className="form-container">
                            <div className="form-header">
                                <h2>Peminjaman Buku</h2>
                            </div>
                            <form className="form-content">
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Guru & Siswa</option>
                                        <option value="guru">Guru</option>
                                        <option value="siswa">Siswa</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="namaPeminjam">Nama Peminjam</label>
                                    <input
                                        type="text"
                                        id="namaPeminjam"
                                        name="namaPeminjam"
                                        value={formData.namaPeminjam}
                                        onChange={handleInputChange}
                                        placeholder="masukkan nama"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalPinjam">Tanggal di pinjam</label>
                                    <input
                                        type="date"
                                        id="tanggalPinjam"
                                        name="tanggalPinjam"
                                        value={formData.tanggalPinjam}
                                        onChange={handleInputChange}
                                        className="form-input date-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalKembali">Tanggal di kembalikan</label>
                                    <input
                                        type="date"
                                        id="tanggalKembali"
                                        name="tanggalKembali"
                                        value={formData.tanggalKembali}
                                        onChange={handleInputChange}
                                        className="form-input date-input"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSimpan}
                                    >
                                        SIMPAN
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleBatal}
                                    >
                                        BATAL
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}

export default Peminjaman