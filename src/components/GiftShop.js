import { useContext, useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GiftShop = () => {
  const { loggedInUser, setLoading, loading } = useContext(BankContext);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [giftItem, setGiftItem] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [gifts, setGifts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const alertShown = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/giftItem/gift-items"
        );
        const fetchedGifts = await Promise.all(
          response.data.map(async (gift) => ({
            ...gift,
            image: `data:${gift.image.contentType
              };base64,${gift?.image?.data}`,
          }))
        );

        setGifts(fetchedGifts);
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
        fetchGifts();
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

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditIndex(null);
    setGiftItem({ name: "", description: "", price: "", image: null });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGiftItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setGiftItem((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data = new FormData();
      data.append("name", giftItem.name);
      data.append("description", giftItem.description);
      data.append("price", giftItem.price);
      data.append("image", imageFile);

      if (editIndex !== null) {
        const response = await axios.put(
          `http://localhost:5000/api/giftItem/edit-gift/${gifts[editIndex]._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedGifts = [...gifts];
        updatedGifts[editIndex] = {
          ...response.data,
          image: `data:${response.data.image.contentType
            };base64,${await arrayBufferToBase64(response.data.image.data.data)}`,
        };
        setGifts(updatedGifts);
        alertShown.current = false;
        if (!alertShown.current) {
          alertShown.current = true;
          alert("Updated Gift Item Successfully");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/giftItem/add-gift",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setGifts([
          ...gifts,
          {
            ...response.data,
            image: `data:${response.data.image.contentType
              };base64,${await arrayBufferToBase64(
                response.data.image.data.data
              )}`,
          },
        ]);
        alertShown.current = false;
        if (!alertShown.current) {
          alertShown.current = true;
          alert("Added Gift Item Successfully");
        }
      }
      handleClose();
    } catch (error) {
      console.error(error);
      setError("Something wrong, item with this name already exist");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setGiftItem(gifts[index]);
    setImagePreview(gifts[index].image);
    handleShow();
  };

  const handleRemove = async (index) => {
    const giftId = gifts[index]._id;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/giftItem/delete-gift/${giftId}`
      );

      const updatedGifts = gifts.filter((_, i) => i !== index);
      setGifts(updatedGifts);
      alertShown.current = false;
      if (!alertShown.current) {
        alertShown.current = true;
        alert("Delete Gift Item Successfully");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete gift item.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (giftItemId) => {
    try {
      setLoading(true);
      let data = JSON.stringify({
        userId: loggedInUser?._id,
        giftItemId: giftItemId,
      });
      const response = await axios.post(
        "http://localhost:5000/api/cart/add-to-cart",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        alertShown.current = false;
        if (!alertShown.current) {
          alertShown.current = true;
          alert("Added To Cart Successfully");
        }
      }
    } catch (err) {
      if (err.response.data === "Already Exist") {
        alertShown.current = false;
        if (!alertShown.current) {
          alertShown.current = true;
          alert("This Gift Item Already Exist in Cart");
        }
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Gift Shop</Card.Title>
          <Card.Text>
            {loggedInUser?.email === "admin@gmail.com" && (
              <Row>
                <Col md={12}>
                  <Button
                    style={{
                      background: "red",
                      border: "none",
                      float: "right",
                    }}
                    variant="primary"
                    onClick={handleShow}
                  >
                    Add Gift Item
                  </Button>
                </Col>
              </Row>
            )}
            <Row style={{ marginTop: "20px" }}>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                gifts.map((gift, index) => {
                  if (loggedInUser?.email !== "admin@gmail.com" && gift.quantity === 0) {
                    return null;
                  }
                  return <Col key={index} md={4} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={gift.image}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{gift.name}</Card.Title>
                        <Card.Text>{gift.description}</Card.Text>
                        <Card.Text><div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            ${gift.price}
                          </span>
                          <span>
                            Qty:{" "}{gift.quantity}
                          </span>
                        </div></Card.Text>
                        {loggedInUser?.email === "admin@gmail.com" ? (
                          <>
                            <Button
                              variant="warning"
                              onClick={() => handleEdit(index)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleRemove(index)}
                            >
                              Remove
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="warning"
                            className="me-2"
                            onClick={() => handleAddToCart(gift?._id)}
                          >
                            Add To Cart
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                }
                )
              )}
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Gift Item" : "Add Gift Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={giftItem.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={giftItem.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={giftItem.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{
                background: "red",
                border: "none",
                marginTop: "10px",
              }}
              disabled={
                !giftItem.price || !giftItem.description || !giftItem.image
              }
            >
              {editIndex !== null ? "Update Gift Item" : "Add Gift Item"}
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Spinner animation="border" />}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GiftShop;
