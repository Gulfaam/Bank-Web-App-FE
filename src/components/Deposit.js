import React, { useState, useContext, useEffect, useRef } from "react";
import { Card, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const navigate = useNavigate();
  const { updateBalance, loggedInUser, loading } = useContext(BankContext);
  const [deposit, setDeposit] = useState(loggedInUser?.isMoneyReceived ? loggedInUser?.receivedMoney : "");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const alertShown = useRef(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setShowMessageModal(true)
  };

  const handleMessageSend = async (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(deposit);
    if (!loggedInUser) {
      setError("Please login first");
      return;
    }
    if (!loggedInUser?.isDeposit) {
      setError(
        "You can't deposit money. Please contact admin to activate deposit feature."
      );
      return;
    }
    if (isNaN(depositAmount)) {
      setError("Please enter a valid number");
      return;
    }
    if (depositAmount <= 0) {
      setError("Deposit amount must be positive");
      return;
    }
    await updateBalance(depositAmount, "deposit", null, false, message);
    setShowMessageModal(false)
    setShowModal(true);
  }

  const handleDepositSalary = async () => {
    if (!loggedInUser) {
      setError("Please login first");
      return;
    }
    const depositAmount = parseFloat(loggedInUser?.salary);
    await updateBalance(depositAmount, "deposit", null, true);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setDeposit("");
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
          <Card.Title>Deposit</Card.Title>

          <Form onSubmit={loggedInUser?.isMoneyReceived ? handleDeposit : handleMessageSend}>
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
            {loggedInUser?.isSalaryReceived && (
              <>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Salary Received
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={"$" + loggedInUser?.salary}
                    disabled
                    style={{ textAlign: "center" }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  style={{
                    marginTop: "10px",
                    background: "red",
                    border: "none",
                  }}
                  onClick={handleDepositSalary}
                >
                  Deposit Salary
                </Button>
              </>
            )}

            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>
                Deposit Amount
              </Form.Label>
              <Form.Control
                type="text"
                value={deposit}
                disabled={loggedInUser?.isMoneyReceived}
                onChange={(e) => setDeposit(e.target.value)}
              />
              <Form.Label style={{ fontWeight: "bold" }}>
                {loggedInUser?.message}
              </Form.Label>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!deposit}
              style={{ marginTop: "30px", background: "red", border: "none" }}
            >
              Deposit
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
            <Modal.Title>Successfully Deposited</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Successfully deposited $${deposit ? deposit : loggedInUser?.salary
            } in your account. Your new balance is $${loggedInUser?.balance + loggedInUser?.transferBalance
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
            <Modal.Title>Receiver's Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input style={{ borderRadius: "5px" }} type="text" placeholder="Enter Message for Sender" onChange={(e) => setMessage(e.target.value)} />
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

export default Deposit;
