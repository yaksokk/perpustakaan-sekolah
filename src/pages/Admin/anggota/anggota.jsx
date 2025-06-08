import { useState, useEffect, useRef } from 'react';
import { Navbar, Sidebar, Table } from "../../../components";
import data from '../../../../data.json'
import './anggota.css'
import './kartuPerpus.css'
import { FaCirclePlus, FaPenToSquare, FaTrash, FaIdCard, FaPrint } from "react-icons/fa6";

const TambahAnggota = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        profesi: "",
        role: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // proses submit data pengguna, misal ke API atau state global
        console.log("Data Anggota:", form);
        alert("Anggota berhasil ditambahkan!");
        setForm({
            username: "",
            password: "",
            name: "",
            profesi: "",
            role: ""
        });
    };

    return (
        <div className="form-add-user">
            <h3>Tambah Anggota</h3>

            <label>Username</label>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <label>Password</label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <label>Nama</label>
            <input
                type="text"
                name="name"
                placeholder="Isi nama"
                value={form.name}
                onChange={handleChange}
                required
            />

            <label>Profesi</label>
            <input
                type="text"
                name="profesi"
                placeholder="Isi profesi"
                value={form.profesi}
                onChange={handleChange}
                required
            />
            <label>Role</label>
            <select
                id='role'
                name="role"
                value={form.role}
                onChange={handleChange}
                required
            >
                <option value="">Pilih Role</option>
                <option value="Operator">Operator</option>
                <option value="User">User</option>
            </select>

            <button onClick={handleSubmit} className="btn-submit">
                Tambah Anggota
            </button>
        </div>
    );
};

const LibraryCard = ({ user, onClose }) => {
    const cardRef = useRef(null);

    const handlePrint = () => {
        const printContent = cardRef.current;
        const originalContent = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Kartu Anggota Perpustakaan</title>');
        printWindow.document.write(`
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif; 
                }
                .library-card {
                    border: 3px solid #000;
                    padding: 20px;
                    background: white;
                    width: 400px;
                    margin: 0 auto;
                }
                .card-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .card-header h2 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                }
                .card-header p {
                    margin: 5px 0 0 0;
                    font-size: 12px;
                }
                .card-body h3 {
                    text-align: center;
                    margin: 0 0 20px 0;
                    font-size: 16px;
                    font-weight: bold;
                }
                .card-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }
                .info-left {
                    flex: 1;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .label {
                    width: 120px;
                    flex-shrink: 0;
                }
                .colon {
                    width: 15px;
                    flex-shrink: 0;
                }
                .value {
                    flex: 1;
                    font-weight: bold;
                }
                .photo-placeholder {
                    width: 80px;
                    height: 100px;
                    border: 2px solid #000;
                    margin-left: 20px;
                    flex-shrink: 0;
                }
                .card-footer {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 40px;
                }
                .signature-section {
                    text-align: center;
                    font-size: 12px;
                }
                .signature-section p {
                    margin: 2px 0;
                }
                .signature-space {
                    height: 40px;
                    margin: 10px 0;
                }
                .signature-name {
                    font-weight: bold;
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="card-perpus-overlay">
            <div className="card-perpus-container">
                <button className="card-perpus-close-button" onClick={onClose}>×</button>

                <div ref={cardRef} className="library-card-perpus">
                    <div className="card-perpus-header">
                        <h2>SD GMIM KANEYAN</h2>
                        <p>Kaneyan, Tareran, Minahasa Selatan, Sulawesi Utara</p>
                    </div>

                    <div className="card-perpus-body">
                        <h3>KARTU ANGGOTA</h3>
                        <div className="card-perpus-info">
                            <div className="info-left">
                                <div className="info-row">
                                    <span className="label">No. Anggota</span>
                                    <span className="colon">:</span>
                                    <span className="value">{user.id || 1}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Nama</span>
                                    <span className="colon">:</span>
                                    <span className="value">{user.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">No. Induk/NISN</span>
                                    <span className="colon">:</span>
                                    <span className="value">{user.username}</span>
                                </div>
                            </div>
                            <div className="photo-placeholder">
                                {/* Photo placeholder */}
                            </div>
                        </div>

                        <div className="card-perpus-footer">
                            <div className="signature-section">
                                <p>Mengetahui,</p>
                                <p>Kepala Sekolah</p>
                                <div className="signature-space"></div>
                                <p className="signature-name">NIP. ________________</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-actions">
                    <button className="btn-print" onClick={handlePrint}>
                        <FaPrint /> Print Kartu
                    </button>
                </div>
            </div>
        </div>
    );
};

function Anggota() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const formRef = useRef(null);

    const users = data.users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (row) => {
        console.log("Edit user:", row);
        // Implement edit functionality
    };

    const handleDelete = (row) => {
        console.log("Delete user:", row);
        // Implement delete functionality
    };

    const handleShowCard = (user) => {
        setSelectedUser(user);
        setShowCard(true);
    };

    const columns = [
        { header: "No", render: (_, idx) => idx + 1 },
        { header: "Username", accessor: "username" },
        { header: "Password", accessor: "password" },
        { header: "Name", accessor: "name" },
        { header: "Profesi", accessor: "profesi" },
        {
            header: "Aksi",
            render: (row) => (
                <div>
                    <button
                        onClick={() => handleEdit(row)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            marginRight: '8px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <FaPenToSquare className="icon" title='Edit' />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            marginRight: '8px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTrash className="icon" title='Hapus' />
                    </button>
                    <button
                        onClick={() => handleShowCard(row)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <FaIdCard className="icon" title='Kartu Anggota' />
                    </button>
                </div>
            )
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowAddUser(false);
            }
        };
        if (showAddUser) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAddUser]);

    const handleToReturnClick = () => {
        setShowAddUser(false);
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id="users" className="content">
                    <h1>Daftar Anggota</h1>
                    <div>
                        <input
                            id='searchUser'
                            type="text"
                            placeholder="Cari anggota berdasarkan nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className='btnAddUser'
                            onClick={() => setShowAddUser(prev => !prev)}
                        >
                            <FaCirclePlus className="icon" /> Tambah Anggota
                        </button>
                    </div>
                    <div id='tableUsers'>
                        <Table columns={columns} data={filteredUsers} />
                    </div>
                    {showAddUser && (
                        <div className="overlayAddUser" onClose={() => setShowAddUser(false)}>
                            <div id="formAddUser" ref={formRef} className="contentAddUser">
                                <button className="close-button" onClick={handleToReturnClick}>×</button>
                                <TambahAnggota />
                            </div>
                        </div>
                    )}
                    {showCard && selectedUser && (
                        <LibraryCard
                            user={selectedUser}
                            onClose={() => setShowCard(false)}
                        />
                    )}
                </main>
            </div>
        </>
    )
}

export default Anggota