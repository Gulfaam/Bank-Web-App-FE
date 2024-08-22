import { Alert, Card, Col, Row, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const PurchasedItems = () => {
  const { loggedInUser, setLoading, loading } = useContext(BankContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const alertShown = useRef(false);

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      const userId = loggedInUser?._id;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/purchased-items/purchased-items/${userId}`
        );
        const fetchedPurchasedItems = await Promise.all(
          response.data.map(async (cart) => ({
            ...cart,
            image: `data:${cart?.giftItemId?.image?.contentType
              };base64,${await arrayBufferToBase64(
                cart?.giftItemId?.image?.data?.data
              )}`,
          }))
        );
        setPurchasedItems(fetchedPurchasedItems);
      } catch (err) {
        console.error(err);
        setError("Failed to load gift items.");
      } finally {
        setLoading(false);
      }
    };
    if (!loggedInUser && !alertShown.current) {
      alertShown.current = true;
      alert("Please Login");
      navigate("/login");
    } else {
      if (loggedInUser) {
        fetchPurchasedItems();
      }
    }
  }, [setLoading]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Purchased Items</Card.Title>
          <Card.Text>
            <Row style={{ marginTop: "20px" }}>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                purchasedItems?.map((cart, index) => {
                  var formattedDate = format(cart?.date, "MMMM do, yyyy H:mma");
                  return (
                    <Col key={index} md={4} className="mb-4">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={cart.image}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Card.Body>
                          <Card.Title>{cart.giftItemId.name}</Card.Title>
                          <Card.Text>{cart.giftItemId.description}</Card.Text>
                          <Card.Text>${cart.currentPrice}</Card.Text>
                          <Card.Text>{formattedDate}</Card.Text>

                          {error && <Alert variant="danger">{error}</Alert>}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              )}
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default PurchasedItems;
