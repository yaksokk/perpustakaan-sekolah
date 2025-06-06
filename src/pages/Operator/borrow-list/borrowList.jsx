import { Navbar, Sidebar } from '../../../components';
import { useState, useEffect } from 'react';
import Table from '../../../components/shared/table/table';

function BorrowList() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [borrowers, setBorrowers] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('daftarPeminjam');
        if (stored) {
            setBorrowers(JSON.parse(stored));
        }
    }, []);

    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
        { header: 'Tanggal Pengembalian', accessor: 'returnDate' },
    ];

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='borrowList' className='content'>
                    <h1>Daftar Peminjam</h1>
                    <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
                        <Table columns={columns} data={borrowers} />
                    </div>
                </main>
            </div>
        </>
    );
}

export default BorrowList;
