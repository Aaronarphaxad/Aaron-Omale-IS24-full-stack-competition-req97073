import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Product } from "@/data/productData";

/* Defining the props that the component will receive. */
interface DeleteProductModalProps {
  openDelete: boolean;
  setOpenDelete: (prev: any) => void;
  data: Product;
  setRefresh: (prev: any) => void;
}

// Delete modal
export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  openDelete,
  setOpenDelete,
  data,
  setRefresh,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpenDelete(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`api/product?id=${data?.productId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        console.log("Product deleted successfully");
        alert("Product Deleted successfully");
        setLoading(false);
        setRefresh((prev: boolean) => (prev = !prev));
        handleClose();
      } else if (response.status === 404) {
        const data = await response.json();
        console.error(data.message);
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("An error occured, try again");
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "5px" }}>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete ${data?.productName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete ${data?.productName}?. If you do this, it is irreversible.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
