import React, { useState } from "react";
import jwt from "jwt-decode";

export const AuthContext = React.createContext({
  user: { token: "", privileges: "" },
  signin: () => undefined,
  signout: () => undefined,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const signin = (payload, callback) => {
    console.log(payload.token);

    const decodedUser = jwt(payload.token);
    const user = {
      token: payload.token,
      privileges: decodedUser.privileges || "user",
    };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    if (callback) {
      callback();
    }
  };

  const signout = (callback) => {
    localStorage.removeItem("user");
    setUser(null);

    if (callback) {
      callback();
    }
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
