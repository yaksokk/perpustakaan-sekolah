import { useState, useEffect, useRef } from 'react';
import { Navbar, Sidebar, Table } from "../../../components";
import data from '../../../../data.json'
import './anggota.css'
import { FaCirclePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // proses submit data pengguna, misal ke API atau state global
        console.log("Data Buku:", form);
        alert("Buku berhasil ditambahkan!");
        setForm({
            username: "",
            password: "",
            name: "",
            profesi: "",
            role: ""
        });
    };

    return (
        <form className="form-add-user" onSubmit={handleSubmit}>
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
                type="text"
                name="password"
                placeholder="password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <label>Nama</label>
            <input
                type="text"
                name="nama"
                placeholder="isi nama"
                value={form.name}
                onChange={handleChange}
                required
            />

            <label>Profesi</label>
            <input
                type="text"
                name="profesi"
                placeholder="isi profesi"
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

            <button type="submit" className="btn-submit">
                Tambah Pengguna
            </button>
        </form>
    );
};

function Anggota() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const formRef = useRef(null);

    const users = data.users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        backgroundColor: '#28a745',  // Green for Edit
                        color: 'white',
                        marginRight: '8px'
                    }}
                >
                    <FaPenToSquare className="icon" title='Edit'/> 
                </button>
                <button
                    onClick={() => handleDelete(row)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#dc3545',  // Red for Delete
                        color: 'white'
                    }}
                >
                    <FaTrash className="icon" title='Hapus'/> 
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
        setShowAddUser(false);  // Ensure it closes the form
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
                            type="text"
                            placeholder="Cari buku berdasarkan judul, penulis, atau kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className='btnAddUser'
                            onClick={() => setShowAddUser(prev => !prev)}
                        >
                            <FaCirclePlus className="icon" /> Tambah Pengguna
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
                </main>
            </div>
        </>
    )
}

export default Anggota