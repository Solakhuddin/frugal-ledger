import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/register', { name, email, password });
      
      // Bisa langsung login otomatis, atau suruh login manual
      // Disini kita simpan session dan langsung masuk dashboard
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      // Handle validasi Zod dari backend (biasanya bentuk array errors)
      if (err.response?.data?.errors) {
         // Ambil error pertama saja biar simpel
         const firstError = Object.values(err.response.data.errors)[0];
         setError(typeof firstError === 'string' ? firstError : 'Input tidak valid');
      } else {
         setError(err.response?.data?.message || 'Registrasi gagal');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Daftar Akun</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                Register
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center bg-white py-3">
            Sudah punya akun? <Link to="/login">Login disini</Link>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
};

export default Register;