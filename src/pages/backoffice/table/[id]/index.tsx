import AppSnackBar from "@/component/AppSnackbar";
import DeleteDialog from "@/component/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { deleteTable, updateTable } from "@/store/slices/tableSlice";
import { UpdateTablePayload } from "@/types/table";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const TableDetail = () => {
  //for default and to update data
  const [updateData, setUpdateData] = useState<UpdateTablePayload>();

  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();
  const tableId = Number(router.query.id);

  const { tables } = useAppSelector(appDataSelector, shallowEqual);
  const dispatch = useAppDispatch();

  const table = tables.find((item) => item.id === tableId);

  useEffect(() => {
    if (table) {
      setUpdateData({ ...table });
    }
  }, [table]);

  if (!updateData) {
    return (
      <Box>
        <Typography>table not found</Typography>
      </Box>
    );
  }

  const handleUpdateData = () => {
    const shouldUpdateData =
      updateData.name !== table.name ||
      updateData.locationId !== table.locationId;

    if (!shouldUpdateData) {
      dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
      return router.push("/backoffice/table");
    }
    dispatch(
      updateTable({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update table successfully",
            })
          );

          router.push("/backoffice/table");
        },
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
          sx={{ width: "fit-content", mb: 2 }}
          color="error"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box>
        <DeleteDialog
          open={open}
          setOpen={setOpen}
          title="Delete table"
          content="Are you sure want to delete this table"
          handleDelete={() => {
            dispatch(
              deleteTable({
                tableId,
                onSuccess: () =>
                  dispatch(
                    showSnackbar({
                      type: "success",
                      message: "delete table successfully.",
                    })
                  ),
              })
            );
            setOpen(false);
            router.push("/backoffice/table");
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <TextField
          defaultValue={updateData.name}
          sx={{ mb: 2, width: "100%" }}
          placeholder="name"
          onChange={(evt) =>
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        <Button
          /*    disabled={
            updateData?.name === menuCategory.name &&
            updateData.isAvailable === menuCategory.isAvailable
          } */
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={handleUpdateData}
        >
          Update
        </Button>
      </Box>
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default TableDetail;
