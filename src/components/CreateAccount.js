import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Modal,
  Spinner,
} from "react-bootstrap";
import { BankContext } from "../context/BankContext";

const CreateAccount = () => {
  const { users, addUser, loading } = useContext(BankContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName) {
      setError("First name is required");
      return;
    }
    if (!lastName) {
      setError("Last name is required");
      return;
    }
    if (firstName.length < 3) {
      setError("First name atleast 3 characters long");
      return;
    }
    if (lastName.length < 3) {
      setError("Last name atleast 3 characters long");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    const user = {
      id: users?.length + 1,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      isLogin: false,
      balance: 100,
    };
    const result = await addUser(user);
    if (result) {
      setShowModal(true);
    } else {
      setError("Account with this email already exist!");
    }
  };

  const handleConfirm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setError("");
    setShowModal(false);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Create Account</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{ marginTop: "30px", background: "red", border: "none" }}
              variant="primary"
              type="submit"
              disabled={!firstName || !lastName || !email || !password}
            >
              Create Account
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
      {loading ? (
        <Spinner />
      ) : (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Account Created</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Congratulations ${firstName}! Your account created successfully and added $100 account creation bonus. Enjoy banking with us. Would you like to add antoher account?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Add Another Account
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CreateAccount;
