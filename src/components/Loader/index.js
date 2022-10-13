import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export const Loader = ({ loading }) => {
  return (
    <Backdrop
      sx={{
        position: "absolute",
        backgroundColor: "#8c8c8c80",
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
