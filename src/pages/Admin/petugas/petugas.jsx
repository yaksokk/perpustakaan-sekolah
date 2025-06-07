import './petugas.css'
import { Navbar, Sidebar, Table } from '../../../components';
import { useState, useEffect, useRef } from 'react';
import { FaCirclePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import data from '../../../../data.json'

const TambahPetugas = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: ""
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
            name: ""
        });
    };

    return (
        <form className="form-add-petugas" onSubmit={handleSubmit}>
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

            <button type="submit" className="btn-submit">
                Tambah Petugas
            </button>
        </form>
    );
};

function Petugas() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showAddPetugas, setShowAddPetugas] = useState(false);
    const formRef = useRef(null);

    const petugas = data.users
    const columns = [
        { header: "No", render: (_, idx) => idx + 1 },
        { header: "Name", accessor: "name" },
        { header: "Password", accessor: "password" },
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
                        <FaPenToSquare className="icon" title='Edit' />
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
                        <FaTrash className="icon" title='Hapus' />
                    </button>
                </div>
            )
        }
    ];

    const handleAddPetugas = () => {
        setShowAddUser(true);
    };

    const handleEdit = (row) => {
        console.log('Edit row:', row);
    };

    const handleDelete = (row) => {
        console.log('Delete row:', row);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowAddPetugas(false);
            }
        };
        if (showAddPetugas) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAddPetugas]);

    const handleToReturnClick = () => {
        setShowAddPetugas(false);
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id="users" className="content">
                    <h1>Daftar Petugas</h1>
                    <div style={{marginTop: '14px'}}>
                        <button
                            className='btnAddPetugas'
                            onClick={() => setShowAddPetugas(prev => !prev)}
                        >
                            <FaCirclePlus className="icon" /> Tambah Pengguna
                        </button>
                    </div>
                    <div id='tablePetugas'>
                        <Table columns={columns} data={petugas} />
                    </div>
                    {showAddPetugas && (
                        <div className="overlayAddPetugas" onClose={() => setShowAddPetugas(false)}>
                            <div id="formAddPetugas" ref={formRef} className="contentAddPetugas">
                                <button className="close-button" onClick={handleToReturnClick}>×</button>
                                <TambahPetugas />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default Petugas