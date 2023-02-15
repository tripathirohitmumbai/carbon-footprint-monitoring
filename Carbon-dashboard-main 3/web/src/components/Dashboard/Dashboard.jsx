import React, { useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";

import { httpGet } from "../../utils/axiosRequests";
import Nav from "../Nav/Nav";
import SearchResults from "./SearchResults";
import { useAuth } from "../../providers/auth";
import { AddHPT } from "../HPT";

const Dashboard = () => {
  const { user } = useAuth();
  const [htpSn, setHptSn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [addHptModalOpen, setAddHptModalOpen] = useState(false);
  const isAdmin = user.privileges === "admin";

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setResult(null);
      setIsLoading(true);

      const { data, error } = await httpGet({
        url: `/hornetpowertool/${htpSn}`,
        headers: {
          Authorization: "Bearer " + user?.token,
        },
      });

      if (data) {
        setResult({ hptDetails: data, status: "Success" });
      } else if (error) {
        if (error.response.status === 404) {
          setResult({ hptDetails: null, status: "Not Found" });
        }
      }

      setIsLoading(false);
    },
    [htpSn, user]
  );

  return (
    <div style={{ position: "relative", height: "calc(100% - 64px - 8px)" }}>
      <Nav />
      <Grid
        container
        rowSpacing={4}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ marginTop: "8px", heigth: "100%" }}
        data-testid="dashboard-container"
      >
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <TextField
                required
                id="standard"
                variant="outlined"
                label="Enter SN# of the tool"
                value={htpSn}
                onChange={(e) => setHptSn(e.target.value)}
                sx={{
                  width: "30vw",
                }}
                color="secondary"
                inputProps={{ "data-testid": "serialnum-input" }}
              />
              <Button
                data-testid="submit-button"
                variant="outlined"
                sx={{ height: "56px", width: "100px" }}
                color="success"
                type="submit"
              >
                Go!
              </Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={12}>
          <SearchResults isLoading={isLoading} data={result} />
        </Grid>
      </Grid>
      {isAdmin && (
        <>
          <div style={{ position: "absolute", bottom: 0, right: 50 }}>
            <IconButton
              onClick={() => {
                setAddHptModalOpen(true);
              }}
            >
              <AddCircleSharpIcon fontSize="large" />
            </IconButton>
          </div>
          <AddHPT
            open={addHptModalOpen}
            handleClose={() => setAddHptModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
