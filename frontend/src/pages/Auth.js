import React, { useState } from "react";

import "./Auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(userInput: { email: $email, password: $password }) {
            _id
            email
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (isLogin) {
      requestBody = {
        query: `
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
        variables: {
          email,
          password,
        },
      };
    }

    try {
      const response = await fetch("http://localhost:3005/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed request.");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <>
      <h1>The Auth Page</h1>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit">{isLogin ? "Login" : "Signup"}</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
