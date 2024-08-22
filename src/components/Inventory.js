import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Inventory = () => {
  const { setLoading, loading, loggedInUser } = useContext(BankContext);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [enteredQuantity, setEnteredQuantity] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [selectedGiftItem, setSelectedGiftItem] = useState(null);
  const alertShown = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      let data = JSON.stringify({
        giftItemId: selectedGiftItem._id,
        quantity: enteredQuantity
      });
      const response = await axios.post(
        "http://localhost:5000/api/inventory/add-more",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setShowModal(false)
        setEnteredQuantity(0)
        alertShown.current = false;
        if (!alertShown.current) {
          alertShown.current = true;
          alert("Added More Item Successfully");
          fetchInventory()
        }
      }
    } catch (err) {
      alertShown.current = false;
      if (!alertShown.current) {
        alertShown.current = true;
        alert("Something wrong " + err);
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/inventory/"
      );
      setInventory(response?.data?.inventory);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/purchased-items/inventory-details`
      );
      setInventoryDetails(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load gift items.");
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
        fetchInventory();
        fetchInventoryDetail()
      }
    }
  }, [setLoading]);

  useEffect(() => {
    if (selectedGiftItem) {
    }
  }, [selectedGiftItem]);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Inventory</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) :
            <Row style={{ fontWeight: "bold" }}>
              <Col md={3}>Gift Item Name</Col>
              <Col md={3}>Quantity in Stock</Col>
              <Col md={3}>Number of Purchased</Col>
              <Col md={3}></Col>
            </Row>}
          {inventory?.map((inven, index) => {
            return (
              <Row style={{ marginTop: "20px" }}>
                <Col md={3}>{inven?.giftItemId?.name}</Col>
                <Col md={3}>{inven?.quantity}</Col>
                <Col md={3}>{inven?.numberOfPurchased}</Col>
                <Col md={3}>
                  <Button
                    style={{ background: "red", border: "none" }}
                    onClick={() => {
                      setSelectedGiftItem(inven?.giftItemId);
                      setShowModal(true);
                    }}
                  >
                    Add More
                  </Button>
                </Col>
              </Row>
            );
          })}
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
      <Card style={{ marginTop: "30px" }}>
        <Card.Body>
          <Card.Title>Purchased Details of Gift Items</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) :
            <Row style={{ fontWeight: "bold" }}>
              <Col md={3}>Gift Item Name</Col>
              <Col md={3}>Purchased By</Col>
              <Col md={2}>Purchased Quantity</Col>
              <Col md={1}>Price</Col>
              <Col md={3}>Timestamp</Col>

            </Row>}
          {inventoryDetails?.map((inven, index) => {
            var formattedDate = format(inven?.date, "MMMM do, yyyy H:mma");
            return (
              <Row style={{ marginTop: "20px" }}>
                <Col md={3}>{inven.giftItem.name}</Col>
                <Col md={3}>{inven.user.email}</Col>
                <Col md={2}>{inven.count}</Col>
                <Col md={1}>${inven.currentPrice * inven.count}</Col>
                <Col md={3}>{formattedDate}</Col>
              </Row>
            );
          })}
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add More {selectedGiftItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    value={enteredQuantity}
                    onChange={(e) => setEnteredQuantity(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              style={{ marginTop: "30px", background: "red", border: "none" }}
              variant="primary"
              type="submit"
              disabled={!enteredQuantity}
            >
              Add More
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Inventory;
