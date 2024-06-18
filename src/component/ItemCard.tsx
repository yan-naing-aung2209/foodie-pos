import { Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  icon: ReactNode;
  title: string;
  isAvailable?: boolean;
  subtitle?: string;
}

const ItemCard = ({
  href,
  icon,
  title,
  isAvailable = true,
  subtitle,
}: Props) => {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "#000000" }}>
      <Paper
        elevation={2}
        sx={{
          width: 170,
          height: 170,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
          opacity: isAvailable ? 1 : 0.4,
          cursor: "pointer",
        }}
      >
        {icon}
        <Typography sx={{ fontWeight: "700" }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 14 }}>{subtitle}</Typography>}
      </Paper>
    </Link>
  );
};

export default ItemCard;
