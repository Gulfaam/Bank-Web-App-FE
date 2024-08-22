import React, { useState, useContext, useEffect, useRef } from "react";
import { Card, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Withdraw = () => {
  const navigate = useNavigate();
  const { loggedInUser, updateBalance, loading, setLoading } =
    useContext(BankContext);
  const [withdraw, setWithdraw] = useState(
    localStorage.getItem("total") ? localStorage.getItem("total") : ""
  );
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const alertShown = useRef(false);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(withdraw);
    if (!loggedInUser) {
      setError("Please login first");
      return;
    }
    if (
      !loggedInUser?.isWithdraw &&
      localStorage.getItem("isBuy") === "false"
    ) {
      setError(
        "You can't withdraw money. Please contact admin to activate withdraw feature."
      );
      return;
    }
    if (isNaN(withdrawAmount)) {
      setError("Please enter a valid number");
      return;
    }
    if (withdrawAmount <= 0) {
      setError("Withdraw amount must be positive");
      return;
    }
    if (withdrawAmount > loggedInUser.balance + loggedInUser?.transferBalance) {
      setError("Insufficient funds");
      return;
    }
    if (
      localStorage.getItem("isBuy") !== "false" &&
      withdrawAmount > loggedInUser?.transferBalance
    ) {
      setError("Insufficient funds for purchase");
      return;
    }
    updateBalance(withdrawAmount, "withdraw");
    if (localStorage.getItem("isBuy") === "true") {
      setLoading(true);

      let data = JSON.stringify({
        userId: loggedInUser?._id,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/api/cart/buy",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          alert("Successfully Purchased");
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setError("Some thing wrong with purchase.");
        });
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    setWithdraw("");
    localStorage.setItem("total", "");
    localStorage.setItem("isBuy", false);
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
          <Card.Title>Withdraw</Card.Title>

          <Form onSubmit={handleWithdraw}>
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
                Transfer Balance
              </Form.Label>
              <Form.Control
                type="text"
                value={"$" + loggedInUser?.transferBalance}
                disabled
                style={{ textAlign: "center" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>
                Withdraw Amount
              </Form.Label>
              <Form.Control
                type="text"
                value={withdraw}
                onChange={(e) => setWithdraw(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!withdraw}
              style={{ marginTop: "30px", background: "red", border: "none" }}
            >
              Withdraw
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
            <Modal.Title>Successfully Withdrawn</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Successfully withdrew $${withdraw} in your account. Your new balance is $${
            loggedInUser?.balance + loggedInUser?.transferBalance
          }.`}</Modal.Body>
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

export default Withdraw;
