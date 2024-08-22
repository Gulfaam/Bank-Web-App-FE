import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Card, Col, Row, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Receipt = () => {
  const { setLoading, loading, loggedInUser } = useContext(BankContext);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState([]);
  const alertShown = useRef(false);
  const navigate = useNavigate();

  const fetchReceipt = async () => {
    setLoading(true);
    try {
      let response = null
      if (loggedInUser?.email === "admin@gmail.com") {
        response = await axios.get(
          `http://localhost:5000/api/receipt/`
        );
      } else {
        response = await axios.get(
          `http://localhost:5000/api/receipt/${loggedInUser?._id}`
        );
      }
      setReceipt(response?.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load Receipt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedInUser && !alertShown.current) {
      alertShown.current = true;
      alert("Please Login");
      navigate("/login");
    } else {
      if (loggedInUser) {
        fetchReceipt();
      }
    }
  }, [setLoading]);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Receipt</Card.Title>
          <Card.Text>
            {receipt?.receipts?.length > 0 && <Row>
              <Col md={12}>
                <div style={{
                  float: "right",
                  fontSize: "20px",
                  display: "flex",
                  gap: "20px"
                }}>
                  <span>
                    Money Send: ${receipt?.totalSendAmount}
                  </span>
                  <span>
                    Money Received: ${receipt?.totalReceiveAmount}
                  </span>
                </div>
              </Col>
            </Row>}
          </Card.Text>
          {loading ? (
            <Spinner animation="border" />
          ) :
            <Row style={{ fontWeight: "bold" }}>
              <Col md={4}>Amount</Col>
              <Col md={4}>Sender</Col>
              <Col md={4}>Receiver</Col>
            </Row>}
          {receipt?.receipts?.map((recep, index) => {
            return (
              <Row style={{ marginTop: "20px" }}>
                <Col md={4}>${recep?.amount}</Col>
                <Col md={4}><div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    {recep?.senderMessage}
                  </span>
                  <span>
                    {recep?.senderId?.email}
                  </span>
                  <span>
                    {recep?.senderTimeStamp}
                  </span>
                </div></Col>
                <Col md={4}><div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    {recep?.receiverMessage}
                  </span>
                  <span>
                    {recep?.receiverId?.email}
                  </span>
                  <span>
                    {recep?.receiverTimeStamp}
                  </span>
                </div></Col>
              </Row>
            );
          })}
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
    </>
  );
};

export default Receipt;
