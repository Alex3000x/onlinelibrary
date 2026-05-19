import { useState, useEffect } from "react";
import { Modal, Table, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

function AdminUsersModal({ show, onHide, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:3000/topinibrary/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Impossibile caricare gli utenti");
    } finally {
      setLoading(false);
    }
  }

  // Carica la lista degli utenti quando il modale viene aperto
  useEffect(() => {
    if (show && currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [show, currentUser]);

  // Gestisce lo switch per cambiare il ruolo (Admin/Standard)
  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await axios.patch(
        `http://localhost:3000/topinibrary/admin/users/${userId}/role`,
        { isAdmin: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      // Aggiorna lo stato locale per riflettere il cambiamento nella tabella
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: newStatus } : user,
        ),
      );
    } catch (err) {
      alert(
        err.response?.data?.error || "Errore durante la modifica del ruolo",
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-danger">
          👑 Area Riservata: Gestione Utenti
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="danger" />
            <p className="small text-muted mt-2">Caricamento utenti...</p>
          </div>
        ) : (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Table hover responsive align="middle" className="border-top">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Email</th>
                  <th className="text-center">Ruolo Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-bold">@{u.username}</td>
                    <td>{u.firstName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.email}</td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        id={`switch-${u._id}`}
                        // Impedisce all'admin di revocare i permessi a se stesso per evitare blocchi
                        disabled={
                          u._id === currentUser?.id ||
                          u._id === currentUser?._id
                        }
                        checked={u.isAdmin}
                        onChange={() => handleToggleAdmin(u._id, u.isAdmin)}
                        style={{ cursor: "pointer", display: "inline-block" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default AdminUsersModal;
