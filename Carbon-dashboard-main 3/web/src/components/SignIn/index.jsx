import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@mui/styles";

import { useAuth } from "../../providers/auth";
import { httpPost } from "../../utils/axiosRequests";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      CO2 Tracker {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundImage: `url('https://adminassets.devops.arabiaweather.com/sites/default/files/field/image/co2-emission.jpg')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    margin: theme.spacing(2, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: '10px',
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const navigate = useNavigate();
  const auth = useAuth();

  const [account, setAccount] = React.useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;

    setAccount(accountCopy);
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password } = account;

      if (!username || !password) {
        setError("Fields can't be empty");
        return;
      }

      const { data, error } = await httpPost({
        url: "/login",
        data: {
          username,
          password,
        },
      });

      if (data) {
        auth.signin({ token: data.authToken }, () => {
          navigate("/");
        });
      } else if (error) {
        setError("Server error: " + error.message);
      }
    },
    [account, auth, navigate]
  );

  return (
    <Grid container component="main" className={classes.root}>
      <Grid
        className={classes.size}
        item
        xs={12}
        sm={8}
        md={3}
        component={Paper}
        elevation={1}
        square
      >
        <div className={classes.paper} data-testid="sign-in-card">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <div style={{ marginTop: "10px" }}>
              {error && (
                <Alert data-testid={"error-message"} severity="error">
                  {error}
                </Alert>
              )}
            </div>
            <TextField
              onChange={(event) => handleAccount("username", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              color="secondary"
              name="username"
              data-testid="username-input"
              autoFocus
            />
            <TextField
              onChange={(event) => handleAccount("password", event)}
              variant="outlined"
              margin="normal"
              color="secondary"
              required
              fullWidth
              name="password"
              label="Password"
              data-testid="password-input"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              data-testid="submit-button"
              fullWidth
              variant="contained"
              color="success"
              className={classes.submit}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
