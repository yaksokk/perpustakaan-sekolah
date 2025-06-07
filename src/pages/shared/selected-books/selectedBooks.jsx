import './selectedBooks.css';
import { Navbar, Sidebar } from '../../../components';
import { useState } from 'react';
import Table from '../../../components/shared/table/table';
import data from '../../../../data.json';

// Buku yang Ingin Dipinjam
function SelectedBooks() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [borrowList, setBorrowList] = useState(data.borrowList);

    const handleSetuju = (id) => {
        const selected = borrowList.find(item => item.id === id);
        // Simpan ke daftar peminjam (sementara ke localStorage atau log)
        const approved = JSON.parse(localStorage.getItem('daftarPeminjam') || '[]');
        localStorage.setItem('daftarPeminjam', JSON.stringify([...approved, selected]));

        // Hapus dari daftar saat ini
        setBorrowList(prev => prev.filter(item => item.id !== id));
    };

    const handleHapus = (id) => {
        setBorrowList(prev => prev.filter(item => item.id !== id));
    };

    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
        {
            header: 'Aksi',
            accessor: 'aksi',
            render: (row) => (
                <>
                    <button
                        style={{ marginRight: 10, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4 }}
                        onClick={() => handleSetuju(row.id)}
                    >
                        Setuju
                    </button>
                    <button
                        style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4 }}
                        onClick={() => handleHapus(row.id)}
                    >
                        Hapus
                    </button>
                </>
            )
        }
    ];

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='selectedBooks' className='content'>
                    <h1>Buku yang Ingin Dipinjam</h1>
                    <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
                        <Table columns={columns} data={borrowList} />
                    </div>
                </main>
            </div>
        </>
    );
}

export default SelectedBooks;
