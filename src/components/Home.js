import React from "react";
import { Card } from "react-bootstrap";
import image from "../assets/images/image.jpeg";
const Home = () => {
  return (
    <Card className="text-center">
      <Card.Header>Welcome to the Bank</Card.Header>
      <Card.Body>
        <Card.Title style={{mariginTop: '20px', marginBottom: '50px'}}>Manage your finances effortlessly.</Card.Title>
        <img src={image} alt="Bank" />
      </Card.Body>
    </Card>
  );
};

export default Home;
