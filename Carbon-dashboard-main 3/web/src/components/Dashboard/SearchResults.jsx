import React from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import ResultsTable from "./ResultsTable";

const SearchResults = ({ isLoading, data }) => {
  return (
    <Grid container spacing={0} direction="column" alignItems="center">
      <Grid item xs={12}>
        {isLoading && !data && (
          <CircularProgress color="secondary" data-testid="hpt-spinner" />
        )}
        {data && data.status === "Success" && (
          <ResultsTable data={data.hptDetails} />
        )}
        {data && data.status === "Not Found" && (
          <Typography sx={{ color: "#707676" }} variant="h5">
            Tool doesn't exist!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default SearchResults;
