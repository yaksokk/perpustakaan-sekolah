import { useState, useEffect, useRef } from 'react';
import { Navbar, Sidebar, Table } from "../../../components";
import './anggota.css';
import './kartuPerpus.css';
import { FaCirclePlus, FaPenToSquare, FaTrash, FaIdCard, FaPrint } from "react-icons/fa6";

const API_URL = 'http://localhost:5000/api/admin/anggota';

const Anggota = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anggota, setAnggota] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', name: '', profesi: '', role: 'user' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const formRef = useRef(null);

  const fetchAnggota = async () => {
    try {
      const res = await fetch(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setAnggota(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal fetch anggota:', err);
      setAnggota([]);
    }
  };

  useEffect(() => { fetchAnggota(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `${API_URL}/update/${editId}` : `${API_URL}/create`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      fetchAnggota();
      setForm({ username: '', password: '', name: '', profesi: '', role: 'user' });
      setIsEditing(false);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, password: user.password, name: user.name, profesi: user.profesi });
    setIsEditing(true);
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus anggota ini?')) return;
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      fetchAnggota();
    } catch (err) {
      alert('Gagal hapus anggota: ' + err.message);
    }
  };

  const filtered = anggota.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns = [
    { header: 'No', accessor: 'id' },
    { header: 'Username', accessor: 'username' },
    { header: 'Password', accessor: 'password' },
    { header: 'Nama', accessor: 'name' },
    { header: 'Profesi', accessor: 'profesi' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="aksi-buttons">
          <button onClick={() => handleEdit(row)}><FaPenToSquare /></button>
          <button onClick={() => handleDelete(row.id)}><FaTrash /></button>
          <button onClick={() => { setSelectedUser(row); setShowCard(true); }}><FaIdCard /></button>
        </div>
      )
    }
  ];

  return (
    <>
      <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Sidebar isActive={showSidebar} />
        <main id="users" className="content">
          <h1>Data Anggota</h1>
          <input
            id='searchUser'
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='btnAddUser' onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setForm({ username: '', password: '', name: '', profesi: '' });
          }}>
            <FaCirclePlus /> Tambah Anggota
          </button>

          <Table columns={columns} data={filtered} />

          {showForm && (
            <div className="overlayAddUser">
              <div className="contentAddUser" ref={formRef}>
                <button className="close-button" onClick={() => setShowForm(false)}>×</button>
                <form className="form-add-user" onSubmit={handleSubmit}>
                  <h3>{isEditing ? 'Edit' : 'Tambah'} Anggota</h3>
                  <label>Username</label>
                  <input name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                  <label>Password</label>
                  <input name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <label>Nama</label>
                  <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <label>Profesi</label>
                  <input name="profesi" value={form.profesi} onChange={(e) => setForm({ ...form, profesi: e.target.value })} required />
                  <button type="submit" className="btn-submit">{isEditing ? 'Perbarui' : 'Tambah'}</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      {showCard && selectedUser && (
        <LibraryCard user={selectedUser} onClose={() => setShowCard(false)} />
      )}
    </>
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

export default Anggota;
