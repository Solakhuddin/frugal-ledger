import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Table, Button, Badge, Modal, Form, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

ChartJS.register(ArcElement, Tooltip, Legend);

// Base URL untuk gambar sesuai backend 
const IMAGE_BASE_URL = 'http://localhost:5000/';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [showTransModal, setShowTransModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  
  const [transForm, setTransForm] = useState({
    amount: '', description: '', categoryId: '', date: '', image: null
  });
  const [catForm, setCatForm] = useState({ name: '', type: 'EXPENSE' });
  
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTrans, resCat] = await Promise.all([
          api.get('/transactions'),
          api.get('/categories')
        ]);
        setTransactions(resTrans.data);
        setCategories(resCat.data);
      } catch (error) {
        console.error("Gagal ambil data", error);
        if (error.response?.status === 401) handleLogout();
      }
    };
    fetchData();
  }, [refresh]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', catForm);
      setRefresh(!refresh); // Trigger refresh data
      setShowCatModal(false);
      setCatForm({ name: '', type: 'EXPENSE' }); // Reset form
      alert('Kategori berhasil dibuat!');
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal buat kategori');
    }
  };

  const handleTransSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('amount', transForm.amount);
    formData.append('description', transForm.description);
    formData.append('categoryId', transForm.categoryId);
    formData.append('date', transForm.date);
    if (transForm.image) {
      formData.append('image', transForm.image);
    }

    try {
      await api.post('/transactions', formData);
      
      setRefresh(!refresh);
      setShowTransModal(false);
      setTransForm({ amount: '', description: '', categoryId: '', date: '', image: null });
    } catch (error) {
      console.error(error);
      alert('Gagal simpan transaksi. Cek inputan.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus transaksi ini?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setRefresh(!refresh);
      } catch (error) {
        alert('Gagal hapus');
      }
    }
  };

  //  Pemasukan
  const totalIncome = transactions
    .filter(t => t.category.type === 'INCOME')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Pengeluaran
  const totalExpense = transactions
    .filter(t => t.category.type === 'EXPENSE')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // 3. Hitung Sisa Saldo
  const balance = totalIncome - totalExpense;

  // 4. Data untuk Chart.js
  const chartData = {
    labels: ['Pemasukan', 'Pengeluaran'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: [
          '#198754', // Hijau (Success) untuk Income
          '#dc3545', // Merah (Danger) untuk Expense
        ],
        hoverBackgroundColor: ['#157347', '#bb2d3b'],
        borderWidth: 2,
      },
    ],
  };


  return (
    <>
      {/* --- NAVBAR --- */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Frugal Ledger 💰</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className='align-items-center gap-3'>
              <span className="text-white">Halo, {user?.name}</span>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {/* --- RINGKASAN & CHART --- */}
        <Row className="mb-5 mt-4">
          {/* Kolom Kiri: Chart Donat */}
          <Col md={4} className="d-flex justify-content-center mb-3 mb-md-0">
             <div style={{ width: '250px', height: '250px' }}>
                {/* Cek jika data kosong, jangan render chart biar ga jelek */}
                {(totalIncome > 0 || totalExpense > 0) ? (
                  <Doughnut data={chartData} />
                ) : (
                  <div className="text-center text-muted pt-5 border rounded bg-light h-100">
                    <p className="mt-4">Belum ada data</p>
                  </div>
                )}
             </div>
          </Col>

          {/* Kolom Kanan: Kartu Ringkasan Angka */}
          <Col md={8}>
            <Row>
               <Col md={4} className="mb-3">
                 <Card className="text-center border-success shadow-sm">
                   <Card.Body>
                     <h6 className="text-muted">Total Pemasukan</h6>
                     <h4 className="text-success">{formatRupiah(totalIncome)}</h4>
                   </Card.Body>
                 </Card>
               </Col>
               <Col md={4} className="mb-3">
                 <Card className="text-center border-danger shadow-sm">
                   <Card.Body>
                     <h6 className="text-muted">Total Pengeluaran</h6>
                     <h4 className="text-danger">{formatRupiah(totalExpense)}</h4>
                   </Card.Body>
                 </Card>
               </Col>
               <Col md={4} className="mb-3">
                 <Card className={`text-center shadow-sm ${balance < 0 ? 'border-danger bg-danger text-white' : 'border-primary bg-primary text-white'}`}>
                   <Card.Body>
                     <h6 className="opacity-75">Sisa Saldo</h6>
                     <h4 className="fw-bold">{formatRupiah(balance)}</h4>
                   </Card.Body>
                 </Card>
               </Col>
            </Row>
            
            <Alert variant="info" className="mt-2">
              💡 <strong>Tips Frugal:</strong> 
              {balance > 0 
                ? " Bagus! Pemasukanmu masih lebih besar dari pengeluaran. Pertahankan!" 
                : " Awas! Pengeluaranmu lebih besar dari pemasukan. Kurangi jajan kopi mewah!"}
            </Alert>
          </Col>
        </Row>

        {/* --- HEADER & ACTION BUTTONS --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Riwayat Transaksi</h3>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => setShowCatModal(true)}>
              + Kategori
            </Button>
            <Button variant="primary" onClick={() => setShowTransModal(true)}>
              + Transaksi Baru
            </Button>
          </div>
        </div>

        {/* --- TABEL TRANSAKSI --- */}
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <Table hover>
            <thead className="bg-light">
              <tr>
                <th>Tanggal</th>
                <th>Bukti</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th className="text-end">Jumlah</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">Belum ada transaksi</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="align-middle">
                    <td>{new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td>
                      {t.imageUrl ? (
                        <a href={IMAGE_BASE_URL + t.imageUrl} target="_blank" rel="noreferrer">
                          <img 
                            src={IMAGE_BASE_URL + t.imageUrl} 
                            alt="struk" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                        </a>
                      ) : <span className="text-muted small">-</span>}
                    </td>
                    <td>
                      <Badge bg={t.category.type === 'INCOME' ? 'success' : 'danger'}>
                        {t.category.name}
                      </Badge>
                    </td>
                    <td>{t.description}</td>
                    <td className={`text-end fw-bold ${t.category.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                      {t.category.type === 'INCOME' ? '+ ' : '- '}
                      {formatRupiah(t.amount)}
                    </td>
                    <td className="text-center">
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(t.id)}>×</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* --- MODAL 1: TAMBAH TRANSAKSI --- */}
      <Modal show={showTransModal} onHide={() => setShowTransModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Catat Transaksi</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Jumlah (Rp)</Form.Label>
              <Form.Control 
                type="number" 
                required 
                value={transForm.amount}
                onChange={(e) => setTransForm({...transForm, amount: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="Misal: Nasi Goreng"
                value={transForm.description}
                onChange={(e) => setTransForm({...transForm, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select 
                required 
                value={transForm.categoryId}
                onChange={(e) => setTransForm({...transForm, categoryId: e.target.value})}
              >
                <option value="">Pilih Kategori...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </Form.Select>
              {categories.length === 0 && <small className="text-danger">Buat kategori dulu!</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control 
                type="date" 
                value={transForm.date}
                onChange={(e) => setTransForm({...transForm, date: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Struk (Opsional)</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => setTransForm({...transForm, image: e.target.files[0]})} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransModal(false)}>Batal</Button>
            <Button variant="primary" type="submit">Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- MODAL 2: TAMBAH KATEGORI --- */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Kategori Baru</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCatSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kategori</Form.Label>
              <Form.Control 
                type="text" required 
                value={catForm.name}
                onChange={(e) => setCatForm({...catForm, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipe</Form.Label>
              <Form.Select 
                value={catForm.type}
                onChange={(e) => setCatForm({...catForm, type: e.target.value})}
              >
                <option value="EXPENSE">Pengeluaran (Expense)</option>
                <option value="INCOME">Pemasukan (Income)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" className="w-100">Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Dashboard;