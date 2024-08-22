import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import AllData from "./components/AllData";
import { BankProvider } from "./context/BankContext";
import Login from "./components/Login";
import Transfer from "./components/Transfer";
import GiftShop from "./components/GiftShop";
import Cart from "./components/Cart";
import PurchasedItems from "./components/PurchasedItems";
import Inventory from "./components/Inventory";
import Receipt from "./components/Receipt";

function App() {
  return (
    <BankProvider>
      <Router>
        <NavigationBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/all-data" element={<AllData />} />
            <Route path="/gift-shop" element={<GiftShop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/purchased-items" element={<PurchasedItems />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
          </Routes>
        </div>
      </Router>
    </BankProvider>
  );
}

export default App;
