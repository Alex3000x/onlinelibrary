import { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';

function SecurityModal({ show, onHide, user, onLogout, onUpdateSuccess }) {
  // Stato per la gestione della password
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  
  // Stato per la gestione dell'email (Punto richiesto)
  const [emailData, setEmailData] = useState({ newEmail: '', confirmPassword: '' });

  // Stati booleani per la visualizzazione delle password in chiaro
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const eyeButtonStyle = { display: 'flex', alignItems: 'center', borderColor: '#ced4da' };

  // Reset dei form quando il modale si chiude o si apre
  useEffect(() => {
    setPasswords({ current: '', new: '' });
    setEmailData({ newEmail: '', confirmPassword: '' });
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  }, [show]);

  // Funzione per il cambio Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/onlinelibrary/users/${user.id}/password`, passwords, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      alert("Password aggiornata correttamente!");
      setPasswords({ current: '', new: '' });
    } catch (err) {
      alert(err.response?.data?.error || "Errore durante l'aggiornamento della password");
    }
  };

  // Funzione per il cambio Email (Verifica con password)
  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      // Chiamata alla futura rotta del backend (PATCH o PUT)
      const response = await axios.patch(`http://localhost:3000/onlinelibrary/users/${user.id}/email`, emailData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      // Aggiorniamo l'utente sia nel localStorage che nello stato globale di App.jsx
      const updatedUser = { ...user, email: emailData.newEmail };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedUser);
      }

      alert("Email aggiornata con successo!");
      setEmailData({ newEmail: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.error || "Errore durante l'aggiornamento dell'email");
    }
  };

  // Funzione per l'eliminazione dell'account
  const handleDeleteAccount = async () => {
    if (window.confirm("Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione non è reversibile.")) {
      try {
        await axios.delete(`http://localhost:3000/onlinelibrary/users/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
        alert("Account eliminato. Ci dispiace vederti andare via!");
        onLogout();
      } catch (err) {
        alert("Errore durante l'eliminazione dell'account.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold" style={{ color: '#e190b6' }}>🔒 Sicurezza Account</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        
        {/* SEZIONE 1: CAMBIO EMAIL */}
        <h6 className="fw-bold mb-3" style={{ color: '#1f1612' }}>Aggiorna Indirizzo Email</h6>
        <Form onSubmit={handleEmailChange} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label className="small">Email Attuale</Form.Label>
            <Form.Control 
              type="email"
              style={{ cursor: 'not-allowed' }} 
              readOnly 
              defaultValue={user?.email || "Non disponibile"} 
              className=""
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small">Nuovo Indirizzo Email</Form.Label>
            <Form.Control 
              type="email" 
              required 
              placeholder="Inserisci la nuova email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small">Password di Conferma</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                placeholder="Digita la tua password attuale"
                value={emailData.confirmPassword}
                onChange={(e) => setEmailData({...emailData, confirmPassword: e.target.value})} 
              />
              <Button variant="outline-secondary" style={eyeButtonStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="outline-primary" className="w-100 fw-bold" style={{ borderColor: '#e190b6', color: '#e190b6' }}>
            Aggiorna Email
          </Button>
        </Form>

        <hr />

        {/* SEZIONE 2: CAMBIO PASSWORD */}
        <h6 className="fw-bold mb-3 mt-3" style={{ color: '#1f1612' }}>Cambia Password</h6>
        <Form onSubmit={handlePasswordChange}>
          <Form.Group className="mb-3">
            <Form.Label className="small">Password Attuale</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showCurrentPassword ? "text" : "password"} 
                required 
                placeholder="La tua vecchia password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
              />
              <Button variant="outline-secondary" style={eyeButtonStyle} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small">Nuova Password</Form.Label>
            <InputGroup>
              <Form.Control 
                // Il trucco magico: il TYPE cambia dinamicamente da "password" a "text"
                type={showNewPassword ? "text" : "password"} 
                required 
                placeholder="Scegli una nuova password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
              />
              {/* Il bottone con l'occhietto attaccato al campo di testo */}
              <Button 
                variant="outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ 
                  borderColor: '#ccc', 
                  display: 'flex', 
                  alignItems: 'center' // Allinea l'icona perfettamente al centro del bottone
                }}
              >
                {showNewPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Button type="submit" variant="outline-primary" className="w-100 fw-bold" style={{ borderColor: '#e190b6', color: '#e190b6' }}>
            Aggiorna Password
          </Button>
        </Form>

        <hr />

        {/* SEZIONE 3: CANCELLAZIONE ACCOUNT */}
        <div className="mt-4 p-3 border border-danger-subtle rounded" style={{ backgroundColor: '#fff5f5' }}>
          <h6 className="text-danger fw-bold">Zona Pericolo</h6>
          <p className="small text-muted">L'eliminazione dell'account prevede una cancellazione definitiva dei tuoi dati personali e quelli relativi al tuo account. Procedere comunque?</p>
          <Button variant="danger" className="w-100 btn-sm fw-bold" onClick={handleDeleteAccount}>
            ELIMINA ACCOUNT
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SecurityModal;