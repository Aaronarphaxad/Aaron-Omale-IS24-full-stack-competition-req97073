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
import {
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { validateInput } from "@/helpers/validate";

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
  data: Product | any;
  setDataToSend: (prev: any) => void;
  setRefresh: (prev: any) => void;
}

// Modal Component
const ProductModal: React.FC<ProductModalProps> = ({
  open,
  handleClose,
  data,
  setDataToSend,
  setRefresh,
}) => {
  // console.log(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataToSend({ ...data, [name]: value });
  };

  const handleDeveloperChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;

    setDataToSend((prevValues: Product) => {
      const developers = [...prevValues?.Developers];
      developers[index] = value;

      return { ...prevValues, Developers: developers };
    });
  };

  const handleSelectChange = (value: string) => {
    setDataToSend((prevData: any) => ({ ...prevData, methodology: value }));
  };

  /**
   * It takes the values from the form and sends a PUT request to the server with the updated values
   */
  const handleSubmit = async () => {
    if (!validateInput(data)) {
      alert("Please fill all inputs and provide at least one developer name");
      return;
    }
    try {
      const response = await fetch(`/api/product?id=${data?.productId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataToSend = await response.json();

      console.log(dataToSend);
      alert(`${dataToSend?.productName} updated succesfully`);
      setRefresh((prev: boolean) => (prev = !prev));
      handleClear();
    } catch (error) {
      alert("An error occured");
    }
  };

  const handleClear = () => {
    handleClose();
  };

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClear}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClear}
                aria-label="close"
              >
                <AiOutlineClose />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Product Details
              </Typography>
            </Toolbar>
          </AppBar>

          <div className="product-detail-container">
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 2, width: "80ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-error"
                  label="Product Name"
                  name="productName"
                  defaultValue={data?.productName}
                  onChange={handleChange}
                />
                <TextField
                  label="Product Owner"
                  name="productOwnerName"
                  defaultValue={data?.productOwnerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  label="Scrum Master"
                  name="scrumMasterName"
                  defaultValue={data?.scrumMasterName}
                  onChange={handleChange}
                />

                {data?.Developers.map((developer: any, index: number) => (
                  <TextField
                    key={index}
                    label={`Developer ${index + 1}`}
                    value={developer}
                    onChange={(event) => handleDeveloperChange(event, index)}
                  />
                ))}
              </div>
              <div>
                <FormHelperText>Methodology</FormHelperText>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={data?.methodology}
                  label="Methodology"
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleSelectChange(event.target.value)
                  }
                >
                  <MenuItem value={"Agile"}>Agile</MenuItem>
                  <MenuItem value={"Waterfall"}>Waterfall</MenuItem>
                </Select>
                <TextField
                  label="Start Date"
                  name="startDate"
                  defaultValue={data?.startDate}
                  // onChange={handleChange}
                  disabled
                />
              </div>
            </Box>
            <Button
              variant="contained"
              style={{ margin: "30px 10px" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ProductModal;
