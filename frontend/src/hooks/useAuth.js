import { useState, useEffect } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/me", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return user;
}