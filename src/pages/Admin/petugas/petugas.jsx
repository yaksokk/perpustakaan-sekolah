// petugas.jsx (final versi CRUD mirip anggota.jsx)
import { useState, useEffect, useRef } from 'react';
import { Navbar, Sidebar, Table } from '../../../components';
import './petugas.css';
import { FaCirclePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

const API_URL = 'http://localhost:5000/api/admin';

const Petugas = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [petugas, setPetugas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'operator' });
  const formRef = useRef(null);

  const fetchPetugas = async () => {
    try {
      const res = await fetch(`${API_URL}/operator/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setPetugas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal fetch petugas:', err);
      setPetugas([]);
    }
  };

  useEffect(() => { fetchPetugas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `${API_URL}/operator/update/${editId}` : `${API_URL}/operator/create`;
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      fetchPetugas();
      setForm({ username: '', password: '', role: 'operator' });
      setIsEditing(false);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      alert('Gagal simpan petugas: ' + err.message);
    }
  };

  const handleEdit = (row) => {
    setForm({ username: row.username, password: row.password, role: row.role });
    setIsEditing(true);
    setEditId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin hapus petugas ini?')) return;
    try {
      const res = await fetch(`${API_URL}/operator/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      fetchPetugas();
    } catch (err) {
      alert('Gagal hapus petugas: ' + err.message);
    }
  };

  const filtered = petugas.filter(p => p.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns = [
    { header: 'No', accessor:'id' },
    { header: 'Username', accessor: 'username' },
    { header: 'Password', accessor: 'password' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="aksi-buttons">
          <button onClick={() => handleEdit(row)}><FaPenToSquare /></button>
          <button onClick={() => handleDelete(row.id)}><FaTrash /></button>
        </div>
      )
    }
  ];

  return (
    <>
      <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Sidebar isActive={showSidebar} />
        <main id="petugas" className="content">
          <h1>Data Petugas</h1>

          <button className='btnAddUser' onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setForm({ username: '', password: '', role: 'operator' });
          }}>
            <FaCirclePlus /> Tambah Petugas
          </button>

          <Table columns={columns} data={filtered} />

          {showForm && (
            <div className="overlayAddPetugas">
              <div className="contentAddPetugas" ref={formRef}>
                <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                <form className="form-add-petugas" onSubmit={handleSubmit}>
                  <h3>{isEditing ? 'Edit' : 'Tambah'} Petugas</h3>
                  <label>Username</label>
                  <input name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                  <label>Password</label>
                  <input name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="submit" className="btn-submit">{isEditing ? 'Perbarui' : 'Tambah'}</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Petugas;
