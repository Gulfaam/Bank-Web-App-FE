import React, { useState, useContext, useEffect, useRef } from "react";
import { Card, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useNavigate } from "react-router-dom";

const Transfer = () => {
  const navigate = useNavigate();
  const { updateBalance, loggedInUser, loading, setLoading } =
    useContext(BankContext);
  const [transfer, setTransfer] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const alertShown = useRef(false);

  const handleTransfer = (e) => {
    e.preventDefault();
    setShowMessageModal(true)
  };

  const handleConfirm = () => {
    setTransfer("");
    setReceiverEmail("");
    setError("");
    setShowModal(false);
  };

  const handleMessageSend = async () => {
    const transferAmount = parseFloat(transfer);
    if (!loggedInUser) {
      setError("Please login first");
      return;
    }
    if (!loggedInUser?.isTransfer) {
      setError(
        "You can't transfer money. Please contact admin to activate transfer feature."
      );
      return;
    }
    if (!receiverEmail) {
      setError("Receiver email is required");
      return;
    }
    if (isNaN(transferAmount)) {
      setError("Please enter a valid number");
      return;
    }
    if (transferAmount <= 0) {
      setError("Transfer amount must be positive");
      return;
    }
    if (transfer > loggedInUser.balance + loggedInUser?.transferBalance) {
      setError("Insufficient funds");
      return;
    }
    const result = await updateBalance(transferAmount, "send", receiverEmail, false, message);
    if (result?.response?.status === 404) {
      setError("Receiver not found with this email");
      setLoading(false);
    } else if (result?.response?.status === 403) {
      setError("Both sender and receiver are same");
      setLoading(false);
    } else {
      setShowMessageModal(false)
      setShowModal(true);
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!loggedInUser && !alertShown.current) {
      alertShown.current = true;
      alert("Please Login");
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Transfer</Card.Title>

          <Form onSubmit={handleTransfer}>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>Account</Form.Label>
              <Form.Control
                type="text"
                value={loggedInUser?.firstName + " " + loggedInUser?.lastName}
                disabled
                style={{ textAlign: "center" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>Balance</Form.Label>
              <Form.Control
                type="text"
                value={
                  "$" + (loggedInUser?.balance + loggedInUser?.transferBalance)
                }
                disabled
                style={{ textAlign: "center" }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>
                Receiver Email
              </Form.Label>
              <Form.Control
                type="text"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>
                Transfer Amount
              </Form.Label>
              <Form.Control
                type="text"
                value={transfer}
                onChange={(e) => setTransfer(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!transfer}
              style={{ marginTop: "30px", background: "red", border: "none" }}
            >
              Transfer
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
            <Modal.Title>Successfully Transferred</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Successfully Transferred $${transfer} from your account. Your new balance is $${loggedInUser?.balance + loggedInUser?.transferBalance
            }.`}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirm}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sender's Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input style={{ borderRadius: "5px" }} type="text" placeholder="Enter Message for Recipient" onChange={(e) => setMessage(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!message} variant="danger" onClick={handleMessageSend}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Transfer;
