import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantitySelector = ({ value, onIncrement, onDecrement }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "100px",
        mt: { xs: 2, sm: 3 },
      }}
    >
      <IconButton
        color={value > 1 ? "primary" : "default"}
        sx={{ mr: 1 }}
        onClick={onDecrement}
      >
        <RemoveCircleIcon />
      </IconButton>
      <Typography variant="h6">{value}</Typography>
      <IconButton color="primary" sx={{ ml: 1 }} onClick={onIncrement}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
