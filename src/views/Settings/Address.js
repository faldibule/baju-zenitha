import React from "react";
import { Container, Typography } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";

export default function Address(props) {
   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" py={3}>
            Daftar Alamat
         </Typography>
      </Container>
   );
}
