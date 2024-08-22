import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { loggedInUser, setLoading, loading } = useContext(BankContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [carts, setCarts] = useState([]);
  const alertShown = useRef(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = loggedInUser?._id;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/cart-items/${userId}`
        );
        setTotal(response?.data?.totalPrice);
        console.log(response.data.carts);
        
        const fetchedCarts = await Promise.all(
          response.data.carts.map(async (cart) => ({
            ...cart,
            image: `data:${
              cart.giftItemId.image.contentType
            };base64,${await arrayBufferToBase64(
              cart?.giftItemId?.image?.data?.data
            )}`,
          }))
        );
        setCarts(fetchedCarts);
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
        fetchCartItems();
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

  const handleRemove = async (index) => {
    const id = carts[index]._id;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/cart/delete-cart/${id}`);

      const updatedCarts = carts.filter((_, i) => i !== index);
      setCarts(updatedCarts);
      setTotal((prev) => prev - carts[index]?.giftItemId?.price);
      alertShown.current = false;
      if (!alertShown.current) {
        alertShown.current = true;
        alert("Remove from Cart Successfully");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to remove from cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Cart</Card.Title>
          <Card.Text>
            {total > 0 && (
              <Row>
                <Col md={12}>
                  <div
                    style={{
                      float: "right",
                      fontSize: "20px",
                    }}
                  >
                    Total: $
                    <span
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      {total}
                    </span>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => {
                        localStorage.setItem("total", total);
                        localStorage.setItem("isBuy", true);
                        navigate("/withdraw");
                      }}
                    >
                      BUY
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
            <Row style={{ marginTop: "20px" }}>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                carts.map((cart, index) => (
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
                        <Card.Text>${cart.giftItemId.price}</Card.Text>

                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() => handleRemove(index)}
                        >
                          Remove From Cart
                        </Button>
                        {error && <Alert variant="danger">{error}</Alert>}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Cart;
