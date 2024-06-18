import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import OrderAppFooter from "./OrderAppFooter";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderAppLayout = ({ children }: Props) => {
  const { query } = useRouter();
  const { tableId, orderSeq } = query;

  const { isLoading } = useAppSelector((state) => state.app);

  const { init, theme } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (tableId && !init) {
      dispatch(fetchAppData({ tableId: String(tableId), orderSeq }));
    }
  }, [tableId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        //pb: { xs: 10, md: 0 },
      }}
    >
      <OrderAppHeader />
      <Box
        sx={{
          backgroundColor: theme === "light" ? "info.main" : "primary.main",
          p: 2,
          width: "100%",
          height: "200vh",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: 200,
            }}
          >
            <CircularProgress size={80} />
          </Box>
        ) : (
          children
        )}
      </Box>
      <OrderAppFooter />
    </Box>
  );
};

export default OrderAppLayout;
