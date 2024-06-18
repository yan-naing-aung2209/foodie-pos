import { Box, Typography } from "@mui/material";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Box>
      <Box>
        <Typography variant="h1">Landing page</Typography>
      </Box>
      <Box>
        <Link href={"/backoffice"}>
          <Typography variant="h4">backoffice app</Typography>
        </Link>
      </Box>
      <Box>
        <Link href={"/order"}>
          <Typography variant="h4">order app</Typography>
        </Link>
      </Box>
    </Box>
  );
}
