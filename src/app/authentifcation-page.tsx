"use client";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import "./App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";
import awsExports from "../aws-exports";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

const App: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>("");

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log("Error fetching JWT token:", error);
    }
  };

  return (
    <Authenticator
      initialState="signIn"
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                <Authenticator.SignUp.FormFields />
                <div>
                  <label>First name</label>
                </div>
                <input
                  type="text"
                  name="given_name"
                  placeholder="Please enter your first name"
                />
                <div>
                  <label>Last name</label>
                </div>
                <input
                  type="text"
                  name="family_name"
                  placeholder="Please enter your last name"
                  className=""
                />
                <div>
                  <label>Email</label>
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder="Please enter a valid email"
                />
              </>
            );
          },
        },
      }}
      services={{
        async validateCustomSignUp(formData: Record<string, string>) {
          const errors: Record<string, string> = {};
          if (!formData.given_name)
            errors.given_name = "First Name is required";
          if (!formData.family_name)
            errors.family_name = "Last Name is required";
          if (!formData.email) errors.email = "Email is required";
          return errors;
        },
      }}
    >
      {({ signOut, user }) => (
        <div>
          Welcome {user?.username}
          <button onClick={signOut}>Sign out</button>
          <h4>Your JWT token:</h4>
          {jwtToken}
        </div>
      )}
    </Authenticator>
  );
};

export default App;
