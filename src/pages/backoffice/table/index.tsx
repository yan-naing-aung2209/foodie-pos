import AppSnackBar from "@/component/AppSnackbar";
import ItemCard from "@/component/ItemCard";
import NewTableDialog from "@/component/NewTableDialog";
import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { selectTable } from "@/store/slices/tableSlice";
import { CreateTablePayload } from "@/types/table";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const Table = () => {
  const { app } = useAppSelector(appDataSelector, shallowEqual);

  const { selectedLocation } = app;

  const tables = useAppSelector(selectTable);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newTable, setNewTable] = useState<CreateTablePayload>({
    name: "",
    locationId: undefined,
  });

  useEffect(() => {
    if (selectedLocation) {
      setNewTable({ ...newTable, locationId: selectedLocation.id });
    }
  }, [selectedLocation]);

  const handleQRImagePrint = (assetUrl: string) => {
    /* const imageWindow = window.open("");
    const htmlTag = `<html>
      <head>
        <title>Print Image</title>
      </head>
      <body style="text-align: center;">
        <img src="${assetUrl}" onload="window.print(); window.close();"/>
      </body>
    </html>`;
    imageWindow.document.write(htmlTag);
    imageWindow?.document.close(); */

    const imageWindow = window.open("");
    imageWindow?.document.write(
      `<html>
      <head>
        <title>Print Image</title>
      </head>
      <body style="text-align: center;">
        <img id="printImage" src="${assetUrl}" />
      <script>
        const printImage = document.getElementById("printImage");
        printImage.onload = function() {
        setTimeout(()=>{
          window.print();
          window.close();
        },10) 
        };
      </script>
      </body>
    </html>`
    );
    imageWindow?.document.close();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          new table
        </Button>
        <Box>
          <NewTableDialog
            newTable={newTable}
            setnewTable={setNewTable}
            open={openDialog}
            setOpen={setOpenDialog}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {tables
          .filter((item) => item.locationId === selectedLocation.id)
          .map((table) => {
            return (
              <Box
                key={table.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box>
                  <ItemCard
                    icon={<TableBarIcon />}
                    href={`/backoffice/table/${table.id}`}
                    title={table.name}
                  />
                </Box>
                <Button
                  sx={{ width: "fit-content" }}
                  variant="contained"
                  onClick={() => handleQRImagePrint(table.assetUrl)}
                >
                  Print QR
                </Button>
              </Box>
            );
          })}
      </Box>
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default Table;
