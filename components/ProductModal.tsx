import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { AiOutlineClose } from "react-icons/ai";
import { Product } from "@/data/productData";

/* A function that returns a component. To add animation to the modal */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* Defining the props that the component will receive. */
interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
  productId: number | undefined;
  setRefresh: (prev: any) => void;
}

// Modal Component
const ProductModal: React.FC<ProductModalProps> = ({
  open,
  handleClose,
  productId,
  setRefresh,
}) => {
  const [productName, setProductName] = React.useState({
    value: "",
    error: false,
  });
  const [productOwnerName, setProductOwnerName] = React.useState({
    value: "",
    error: false,
  });
  const [scrumMasterName, setScrumMasterName] = React.useState({
    value: "",
    error: false,
  });
  const [Developers, setDevelopers] = React.useState({
    value: [""],
    error: false,
  });
  const [methodology, setMethodology] = React.useState({
    value: "",
    error: false,
  });
  const [startDate, setStartDate] = React.useState({ value: "", error: false });
  const [error, setError] = React.useState<boolean>(false);

  const handleSubmit = () => {
    handleClose();
    alert(Developers.value);
    setRefresh((prev: boolean) => (prev = !prev));
  };

  React.useEffect(() => {
    /**
     * It fetches the data from the local data store and sets the state of the form to the data fetched
     */
    const handleFetch = async () => {
      if (open) {
        try {
          const response = await fetch("/api/product", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ id: productId }),
          });

          const data = await response.json();
          setProductName({ value: data?.productName, error: false });
          setProductOwnerName({ value: data?.productOwnerName, error: false });
          setDevelopers({ value: data?.Developers, error: false });
          setStartDate({ value: data?.startDate, error: false });
          setScrumMasterName({ value: data?.scrumMasterName, error: false });
          setMethodology({ value: data?.methodology, error: false });
        } catch (error) {
          alert("An error occured");
        }
      }
    };
    handleFetch();
  }, [open, productId]);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <AiOutlineClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Product Details
            </Typography>

            <Button autoFocus color="inherit" onClick={handleSubmit}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <div className="product-detail-container">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "30ch" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submited");
            }}
          >
            <div>
              <TextField
                error={error}
                id="outlined-error"
                label="Product Name"
                defaultValue={productName?.value}
                onChange={(e) => {
                  const newObj = { ...productName };
                  newObj.value = e.target.value;
                  setProductName(newObj);
                }}
              />
              <TextField
                error={error}
                // id="outlined-error-helper-text"
                label="Product Owner"
                defaultValue={productOwnerName?.value}
                onChange={(e) => {
                  const newObj = { ...productOwnerName };
                  newObj.value = e.target.value;
                  setProductOwnerName(newObj);
                }}
              />
            </div>
            <div>
              <TextField
                error={error}
                // id="filled-error"
                label="Scrum Master"
                defaultValue={scrumMasterName?.value}
                onChange={(e) => {
                  const newObj = { ...scrumMasterName };
                  newObj.value = e.target.value;
                  setScrumMasterName(newObj);
                }}
              />
              <TextField
                error={error}
                // id="filled-error-helper-text"
                label="Developers"
                defaultValue={Developers?.value}
                onChange={(e) => {
                  const newObj = { ...Developers };
                  newObj.value = e.target.value.split(", ");
                  setDevelopers(newObj);
                }}
              />
            </div>
            <div>
              <TextField
                error={error}
                // id="standard-error"
                label="Methodology"
                defaultValue={methodology?.value}
                onChange={(e) => {
                  const newObj = { ...methodology };
                  newObj.value = e.target.value;
                  setMethodology(newObj);
                }}
              />
              <TextField
                error={error}
                label="Start Date"
                defaultValue={startDate?.value}
                onChange={(e) => {
                  const newObj = { ...startDate };
                  newObj.value = e.target.value;
                  setStartDate(newObj);
                }}
              />
            </div>
            {/* <button type="submit">Submit</button> */}
          </Box>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductModal;
