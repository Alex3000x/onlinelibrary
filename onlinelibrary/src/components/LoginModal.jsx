import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

function LoginModal({ show, onHide, onSwitchToRegister, onLoginSuccess }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
      setShowPassword(false);
    }, [show]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Tentativo Login con:", loginData);
    // fetch POST /login
    try {
        const response = await axios.post("http://localhost:3000/onlinelibrary/login", { email: loginData.email, password: loginData.password });
        
        // Salva i dati nel browser
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Funzione passata da App.jsx per aggiornare lo stato dell'utente
        onLoginSuccess(response.data.user); 
        onHide();
    } catch (err) {
        alert(err.response?.data?.error || "Errore durante il login");
        console.error("Login fallito:", err.response?.data?.error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-blur">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-dark">Accedi alla Libreria</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control 
              type="email" name="email" placeholder="nome@esempio.it" required
              value={loginData.email} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"} 
                name="password" // <--- Fondamentale per far funzionare il tuo handleChange!
                placeholder="********" 
                required
                value={loginData.password} 
                onChange={handleChange}
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ display: 'flex', alignItems: 'center', borderColor: '#ced4da' }}
              >
                {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Button variant="info" type="submit" className="w-100 rounded-pill fw-bold text-white mb-3">
            Entra
          </Button>
          <div className="text-center">
            <span className="text-muted">Non sei ancora registrato? </span>
            <Button 
              variant="link" 
              className="p-0 text-info fw-bold text-decoration-none"
              onClick={onSwitchToRegister} // Chiude login e apre registrazione
            >
              Registrati
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;