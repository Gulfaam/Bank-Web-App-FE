import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const BankContext = createContext();

export const BankProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(false);

  const updateBalance = async (
    amount,
    type,
    receiverEmail,
    isSalary,
    message
  ) => {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const dateString = date.toDateString();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLoading(true);
    let data = JSON.stringify({
      userId: loggedInUser._id,
      type,
      amount,
      time: dateString + " - " + time,
      receiverEmail,
      isSalary,
      isBuy: localStorage.getItem("isBuy"),
      message
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/user/update-balance",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      await axios.request(config);
      let config2 = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:5000/api/user/${loggedInUser._id}`,
        headers: {},
      };

      axios
        .request(config2)
        .then((response) => {
          setLoggedInUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      setLoading(false);
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const addUser = async (user) => {
    setLoading(true);
    let data = JSON.stringify({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      password: user?.password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      await axios.request(config);
      setLoading(false);
      return true;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return false;
    }
  };

  const updateFields = async (id, field) => {
    let data = JSON.stringify({
      field: field,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/api/user/update/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:5000/api/user/transactions",
          headers: {},
        };

        axios
          .request(config)
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const updatedUsers = users.map((u) => {
      if (u?._id === loggedInUser?._id) {
        u.isLogin = true;
      } else {
        u.isLogin = false;
      }
      return u;
    });
    setUsers(updatedUsers);
  }, [loggedInUser]);

  return (
    <BankContext.Provider
      value={{
        updateBalance,
        users,
        addUser,
        loggedInUser,
        setLoggedInUser,
        loading,
        setLoading,
        setUsers,
        updateFields,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
