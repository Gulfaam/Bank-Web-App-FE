import React, { useContext, useEffect, useState } from "react";
import { Card, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import axios from "axios";

const Login = () => {
  const { loading, setLoggedInUser, setLoading, loggedInUser } =
    useContext(BankContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loggedInUser) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:5000/api/auth/logout/${loggedInUser?._id}`,
        headers: {},
      };

      try {
        axios.request(config);
        setLoggedInUser(null);
        alert("Logged out successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!email) {
        setError("Email is required");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      setLoading(true);

      let data = JSON.stringify({
        email: email,
        password: password,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/api/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.isActive) {
            setLoggedInUser(response.data);
            setShowModal(true);
            localStorage.setItem("isBuy", false);
            localStorage.setItem("total", "");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setError("Invalid Credentials or Your account is inactive.");
        });
    }
  };

  const handleConfirm = () => {
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
          <Card.Title>Login</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                disabled={loggedInUser}
                type="email"
                value={loggedInUser ? "" : email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                disabled={loggedInUser}
                type="password"
                value={loggedInUser ? "" : password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{ marginTop: "30px", background: "red", border: "none" }}
              variant="primary"
              type="submit"
              disabled={!loggedInUser && (!email || !password)}
            >
              {loggedInUser ? "Log Out" : "Login"}
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
            <Modal.Title>Successfully Logged In</Modal.Title>
          </Modal.Header>
          <Modal.Body>Successfully logged in to your account.</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirm}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Login;
