import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { BankContext } from "../context/BankContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllData = () => {
  const navigate = useNavigate();
  const { users, loggedInUser, setUsers, updateFields } =
    useContext(BankContext);
  const alertShown = useRef(false);
  const alertShown2 = useRef(false);
  const [salaryInputs, setSalaryInputs] = useState({});
  useEffect(() => {
    if (!loggedInUser && !alertShown.current) {
      alertShown.current = true;
      alert("Please Login");
      navigate("/login");
    } else {
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
    }
  }, [loggedInUser, navigate, setUsers]);

  const handleActiveChange = async (userId, field) => {
    await updateFields(userId, field);
  };

  const handleSalaryInput = (e, userId) => {
    const { value } = e.target;
    setSalaryInputs((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleProcessSalary = async (userId) => {
    const salary = salaryInputs[userId];
    if (!salary && !alertShown2.current) {
      alertShown2.current = true;
      alert("Please enter a valid salary amount");
    } else {
      let data = JSON.stringify({
        salary: salary,
      });

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `http://localhost:5000/api/user/process-salary/${userId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      try {
        await axios.request(config);
        alert("Salary processed successfully");
        setSalaryInputs((prev) => ({
          ...prev,
          [userId]: "",
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleProcessSalaryInBulk = async () => {
    const usersWithSalary = Object.keys(salaryInputs).filter(
      (userId) => salaryInputs[userId]
    );
    if (usersWithSalary.length === 0) {
      alert("No users have a salary value entered.");
      return;
    }

    try {
      const bulkRequests = usersWithSalary?.map(async (userId) => {
        let data = JSON.stringify({
          salary: salaryInputs[userId],
        });

        let config = {
          method: "put",
          maxBodyLength: Infinity,
          url: `http://localhost:5000/api/user/process-salary/${userId}`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        const response = await axios.request(config);
        return response.data;
      });

      await Promise.all(bulkRequests);
      alert("Salaries processed successfully");

      setSalaryInputs({});
    } catch (error) {
      console.log(error);
      alert("An error occurred while processing salaries.");
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>All Data</Card.Title>
        <Card.Text>
          {loggedInUser?.email === "admin@gmail.com" ? (
            <Row
              style={{
                fontWeight: "bold",
                borderBottom: "1px solid black",
                marginTop: "20px",
              }}
            >
              <Col md={1}>Logged In</Col>
              <Col md={1}>First Name</Col>
              <Col md={1}>Last Name</Col>
              <Col md={2}>Email</Col>
              <Col md={2}>Password</Col>
              <Col md={1}>Balance</Col>
              <Col md={1}>Active</Col>
              <Col md={1}>Withdraw</Col>
              <Col md={1}>Deposit</Col>
              <Col md={1}>Transfer</Col>
            </Row>
          ) : (
            <Row
              style={{
                fontWeight: "bold",
                borderBottom: "1px solid black",
                marginTop: "20px",
              }}
            >
              <Col md={2}>Logged In</Col>
              <Col md={2}>First Name</Col>
              <Col md={2}>Last Name</Col>
              <Col md={2}>Email</Col>
              <Col md={2}>Password</Col>
              <Col md={2}>Balance</Col>
            </Row>
          )}
          {users?.map((user, index) => {
            let headerRendered = false;
            return (
              <Col key={index}>
                {loggedInUser?.email === "admin@gmail.com" ? (
                  <Row style={{ paddingTop: "20px" }}>
                    <Col md={1}>
                      <input type="checkbox" checked={user.isLogin} />
                    </Col>
                    <Col md={1}>{user.firstName}</Col>
                    <Col md={1}>{user.lastName}</Col>
                    <Col md={2}>{user.email}</Col>
                    <Col md={2}>{user.password}</Col>
                    <Col md={1}>${user.balance + user?.transferBalance}</Col>
                    <Col md={1}>
                      <input
                        type="checkbox"
                        checked={user?.isActive}
                        onChange={() =>
                          handleActiveChange(user._id, "isActive")
                        }
                      />
                    </Col>
                    <Col md={1}>
                      <input
                        type="checkbox"
                        checked={user?.isWithdraw}
                        onChange={() =>
                          handleActiveChange(user._id, "isWithdraw")
                        }
                      />
                    </Col>
                    <Col md={1}>
                      <input
                        type="checkbox"
                        checked={user?.isDeposit}
                        onChange={() =>
                          handleActiveChange(user._id, "isDeposit")
                        }
                      />
                    </Col>
                    <Col md={1}>
                      <input
                        type="checkbox"
                        checked={user?.isTransfer}
                        onChange={() =>
                          handleActiveChange(user._id, "isTransfer")
                        }
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row style={{ paddingTop: "20px" }}>
                    <Col md={2}>
                      <input type="checkbox" checked={user.isLogin} />
                    </Col>
                    <Col md={2}>{user.firstName}</Col>
                    <Col md={2}>{user.lastName}</Col>
                    <Col md={2}>{user.email}</Col>
                    <Col md={2}>
                      {user?._id === loggedInUser?._id ? user.password : "****"}
                    </Col>
                    <Col md={2}>${user.balance + user?.transferBalance}</Col>
                  </Row>
                )}
                <Row style={{ border: "1px solid black", marginLeft: "200px" }}>
                  {user?.transactions?.map((entry, index) => {
                    if (
                      (entry?.userId === user?._id &&
                        entry?.userId === loggedInUser?._id) ||
                      loggedInUser?.email === "admin@gmail.com"
                    ) {
                      if (!headerRendered) {
                        headerRendered = true;
                        return (
                          <React.Fragment key="header">
                            <Row
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              <Col md={4}>Transactions</Col>
                              <Col md={4}>Type</Col>
                              <Col md={2}>Amount</Col>
                              <Col md={2}>Running Balance</Col>
                            </Row>
                            <Row key={index}>
                              <Col md={4}>{entry.time}</Col>
                              {entry?.type === "send" ||
                              entry?.type === "receive" ? (
                                <Col md={4}>
                                  <span style={{ textTransform: "capitalize" }}>
                                    {entry.type}
                                  </span>{" "}
                                  {"("}
                                  {entry.type === "send" ? "to" : "from"}{" "}
                                  {entry?.senderOrReceiverEmail} {")"}
                                </Col>
                              ) : (
                                <Col
                                  style={{ textTransform: "capitalize" }}
                                  md={4}
                                >
                                  {entry.type}
                                </Col>
                              )}
                              <Col md={2}>${entry.amount}</Col>
                              <Col md={2}>${entry.runningBalance}</Col>
                            </Row>
                          </React.Fragment>
                        );
                      }
                      return (
                        <Row key={index}>
                          <Col md={4}>{entry.time}</Col>
                          {entry?.type === "send" ||
                          entry?.type === "receive" ? (
                            <Col md={4}>
                              <span style={{ textTransform: "capitalize" }}>
                                {entry.type}
                              </span>{" "}
                              {"("}
                              {entry.type === "send" ? "to" : "from"}{" "}
                              {entry?.senderOrReceiverEmail} {")"}
                            </Col>
                          ) : (
                            <Col style={{ textTransform: "capitalize" }} md={4}>
                              {entry.type}
                            </Col>
                          )}
                          <Col md={2}>${entry.amount}</Col>
                          <Col md={2}>${entry.runningBalance}</Col>
                        </Row>
                      );
                    }
                    return null;
                  })}
                </Row>
                {loggedInUser?.email === "admin@gmail.com" &&
                  user?.email !== "admin@gmail.com" && (
                    <Row style={{ marginLeft: "200px", marginTop: "20px" }}>
                      <Col md={3}>
                        <span style={{ fontWeight: "bold" }}>Send Salary</span>
                      </Col>
                      <Col md={6}>
                        <input
                          type="text"
                          style={{ width: "200px" }}
                          value={salaryInputs[user._id] || ""}
                          onChange={(e) => handleSalaryInput(e, user._id)}
                        />
                      </Col>
                      <Col md={3}>
                        <Button
                          style={{ background: "red", border: "none" }}
                          variant="primary"
                          type="submit"
                          onClick={() => handleProcessSalary(user._id)}
                          disabled={!salaryInputs[user._id]}
                        >
                          Process Salary
                        </Button>
                      </Col>
                    </Row>
                  )}
              </Col>
            );
          })}
        </Card.Text>
        {loggedInUser?.email === "admin@gmail.com" && (
          <Button
            style={{ background: "red", border: "none" }}
            variant="primary"
            type="submit"
            onClick={() => handleProcessSalaryInBulk()}
            disabled={
              Object.keys(salaryInputs).filter((userId) => salaryInputs[userId])
                .length <= 0
            }
          >
            Process All Entered Salaries
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default AllData;
