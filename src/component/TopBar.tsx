import { useAppSelector } from "@/store/hooks";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
const TopBar = () => {
  const { selectedLocation, theme } = useAppSelector((state) => state.app);
  const { data } = useSession();
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme === "light" ? "success.dark" : "primary.main",
        height: "8%",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Foodie POS
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {selectedLocation?.name}
        </Typography>
        {data ? (
          <Button color="inherit" onClick={() => signOut()}>
            signout
          </Button>
        ) : (
          <span></span>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
