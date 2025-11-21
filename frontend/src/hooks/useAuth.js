import { useState, useEffect } from "react";
import axios from "axios";

/*
  Custom hook to manage user authentication state.
  Returns:
    - undefined: authentication status is loading
    - null: user is not logged in
    - object: user is logged in, contains:
        { userId, username,}
*/
export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    axios.get("http://localhost:3001/auth/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(err => {
            if (err.response && err.response.status === 401) {
                setUser(null); // user is not logged in
            } else {
                console.error(err);
            }
         });
  }, []);

  return user;  // undefined = loading, null = logged out, object = logged in
}