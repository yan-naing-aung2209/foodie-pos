import { BaseUser } from "@/types/user";
import { Box, Button, Divider, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [user, setUser] = useState<BaseUser>({ email: "", password: "" });

  /*   const loginData = async () => {
    if (!user.email || !user.password) {
      return alert("email & password field required");
    }
    const response = await fetch("http://localhost:5000/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(user),
    });
    const { token } = await response.json();

    localStorage.setItem("token", token);
    navigate("/");
  }; */
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 500,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              placeholder="email"
              sx={{ my: 1 }}
              onChange={(evt) => setUser({ ...user, email: evt.target.value })}
            />
            <TextField
              placeholder="password"
              type="password"
              sx={{ my: 1 }}
              onChange={(evt) =>
                setUser({ ...user, password: evt.target.value })
              }
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" sx={{ width: "fit-content" }}>
                login
              </Button>
            </Box>
          </Box>
          <Divider sx={{ bgcolor: "lightgray", my: 10 }} />
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
            >
              sign in with google
            </Button>
            <Button variant="contained">sign in with facebook</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
