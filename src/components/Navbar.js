import React, { useContext } from "react";
import { Navbar, Nav, Tooltip, OverlayTrigger } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { BankContext } from "../context/BankContext";
const NavigationBar = () => {
  const { loggedInUser } = useContext(BankContext);
  return (
    <Navbar bg="danger" expand="lg" className="navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="home-tooltip">Go to Home Page</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/home">
              Home
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="create-account-tooltip">
                Create a New Account
              </Tooltip>
            }
          >
            <Nav.Link as={NavLink} to="/create-account">
              Create Account
            </Nav.Link>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="login-tooltip">Login to Account</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/login">
              Login
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="deposit-tooltip">Deposit Money</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/deposit">
              Deposit
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="withdraw-tooltip">Withdraw Money</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/withdraw">
              Withdraw
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="transfer-tooltip">Transfer Money</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/transfer">
              Transfer
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="all-data-tooltip">View All Data</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/all-data">
              All Data
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="gift-shop-tooltip">Gift Shop</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/gift-shop">
              Gift Shop
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="cart-tooltip">Cart</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/cart">
              Cart
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="purchased-items-tooltip">Purchased Items</Tooltip>
            }
          >
            <Nav.Link as={NavLink} to="/purchased-items">
              Purchased Items
            </Nav.Link>
          </OverlayTrigger>
          {loggedInUser?.email === "admin@gmail.com" && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="inventory-tooltip">Inventory</Tooltip>}
            >
              <Nav.Link as={NavLink} to="/inventory">
                Inventory
              </Nav.Link>
            </OverlayTrigger>
          )}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="receipt-tooltip">Receipt</Tooltip>}
          >
            <Nav.Link as={NavLink} to="/receipt">
              Receipt
            </Nav.Link>
          </OverlayTrigger>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
