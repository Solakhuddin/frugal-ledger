import { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Pastikan path ini benar sesuai strukturmu

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error
    
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Simpan user & token ke LocalStorage
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect ke Dashboard
      navigate('/'); 
    } catch (err) {
      // Tampilkan pesan error dari backend atau default
      setError(err.response?.data?.message || 'Login gagal, cek koneksi');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Masuk</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="******" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center bg-white py-3">
            Belum punya akun? <Link to="/register">Daftar disini</Link>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
};

export default Login;