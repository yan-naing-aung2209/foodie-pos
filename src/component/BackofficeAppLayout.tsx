import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector, fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { shallowEqual } from "react-redux";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
}

const BackofficeAppLayout = ({ children }: Props) => {
  const { data } = useSession();
  const { app } = useAppSelector(appDataSelector, shallowEqual);

  const { init, theme } = app;

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!init) {
      dispatch(fetchAppData({}));
    }
  }, [!init]);

  return (
    <Box>
      <TopBar />
      <Box sx={{ display: "flex", height: "200vh" }}>
        {data && <SideBar />}
        <Box
          sx={{
            backgroundColor: theme === "light" ? "info.main" : "primary.dark",
            p: 2,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default BackofficeAppLayout;
