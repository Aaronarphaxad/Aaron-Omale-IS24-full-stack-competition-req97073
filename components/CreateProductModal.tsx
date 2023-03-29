import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Box } from "@mui/material/";

/* Defining the data that will be sent to the server. */
interface FormData {
  productName: string;
  productOwnerName: string;
  Developers: string[];
  scrumMasterName: string;
  methodology: string;
  startDate: string;
}

/* Defining the data that will be saved in state to monitor everything */
interface CreateInterface {
  productName: string;
  productOwnerName: string;
  Developers: string[];
  scrumMasterName: string;
  methodology: string;
  startDate: string;
  errors: {
    productName: string;
    productOwnerName: string;
    Developers: string[] | null;
    scrumMasterName: string;
    methodology: string;
    startDate: string;
  };
}

/* Defining the props that the component will receive. */
interface CreateProductModalProps {
  openCreate: boolean;
  setOpenCreate: (prev: any) => void;
  setRefresh: (prev: any) => void;
}

// Create modal Component
export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  openCreate,
  setOpenCreate,
  setRefresh,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<CreateInterface>({
    productName: "",
    productOwnerName: "",
    Developers: ["", "", "", "", ""],
    scrumMasterName: "",
    methodology: "",
    startDate: "",
    errors: {
      productName: "This field is required",
      productOwnerName: "This field is required",
      Developers: null,
      scrumMasterName: "This field is required",
      methodology: "This field is required",
      startDate: "This field is required",
    },
  });

  /**
   * We're using the spread operator to copy the previous state, then we're updating the value of the
   * name property with the value of the input field
   * @param event - React.ChangeEvent<HTMLInputElement>
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: value.trim() === "" ? "This field is required" : null,
      },
    }));
  };

  /**
   * It takes an event and an index, and then sets the data state to the previous state, with the
   * Developers array updated with the new value at the index
   * @param event - React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   * @param {number} index - The index of the developer name in the array of developer names.
   */
  const handleDeveloperChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;

    setData((prevState) => ({
      ...prevState,
      Developers: [
        ...prevState.Developers.slice(0, index),
        value,
        ...prevState.Developers.slice(index + 1),
      ],
      errors: {
        ...prevState.errors,
        Developers: prevState.Developers.some((name) => name.trim() === "")
          ? ["At least one developer name is required"]
          : null,
      },
    }));
  };

  function handleClose() {
    setOpenCreate(false);
    setLoading(false);
    resetData();
  }

  // Function to submit data to the server to attempt to create a new product
  const handleCreate = async () => {
    setLoading(true);
    let { errors, ...formData } = data;

    const hasEmptyFields = Object.values(formData).some(
      (field) => field === ""
    );
    // const hasErrors = Object.values(errors).some((error) => error !== null);
    const hasNonEmptyDevelopers = formData.Developers.some(
      (name) => name.trim() !== ""
    );

    if (hasEmptyFields || !hasNonEmptyDevelopers) {
      setLoading(false);
      alert("Please fill all inputs and provide at least one developer name");
      return;
    } else {
      try {
        const response = await fetch("api/product", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (response.ok) {
          console.log("Product created successfully: ", data);
          alert("Product Created successfully");
          setLoading(false);
          resetData();
          setRefresh((prev: boolean) => (prev = !prev));
          handleClose();
        } else if (response.status === 404) {
          const data = await response.json();
          alert(data.message);
        } else {
          alert("Failed to create product");
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        alert("An error occured, try again");
        setLoading(false);
      }
    }
  };

  const resetData = () => {
    setData({
      productName: "",
      productOwnerName: "",
      Developers: ["", "", "", "", ""],
      scrumMasterName: "",
      methodology: "",
      startDate: "",
      errors: {
        productName: "This field is required",
        productOwnerName: "This field is required",
        Developers: null,
        scrumMasterName: "This field is required",
        methodology: "This field is required",
        startDate: "This field is required",
      },
    });
  };

  return (
    <div style={{ margin: "5px" }}>
      <Dialog
        open={openCreate}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create New Product</DialogTitle>
        <div className="product-detail-container">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "30ch" },
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
                onChange={handleInputChange}
                error={Boolean(data.errors.productName)}
                helperText={data.errors.productName}
              />
              <TextField
                label="Product Owner"
                name="productOwnerName"
                value={data.productOwnerName}
                onChange={handleInputChange}
                error={Boolean(data.errors.productOwnerName)}
                helperText={data.errors.productOwnerName}
              />
            </div>
            <div>
              <TextField
                label="Scrum Master"
                name="scrumMasterName"
                value={data.scrumMasterName}
                onChange={handleInputChange}
                error={Boolean(data.errors.scrumMasterName)}
                helperText={data.errors.scrumMasterName}
              />
              {/* <TextField
                label="Developers (comma separated)"
                name="Developers"
                value={data.Developers}
                onChange={handleInputChange}
                error={Boolean(data.errors.Developers)}
                helperText={data.errors.Developers}
              /> */}
              {data.Developers.map((developer, index) => (
                <TextField
                  key={index}
                  label={`Developer ${index + 1}`}
                  value={developer}
                  onChange={(event) => handleDeveloperChange(event, index)}
                />
              ))}
            </div>
            <div>
              <TextField
                label="Methodology"
                name="methodology"
                value={data.methodology}
                onChange={handleInputChange}
                error={Boolean(data.errors.methodology)}
                helperText={data.errors.methodology}
              />
              <TextField
                label="Start Date"
                name="startDate"
                value={data.startDate}
                onChange={handleInputChange}
                error={Boolean(data.errors.startDate)}
                helperText={data.errors.startDate}
              />
            </div>
          </Box>
        </div>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} autoFocus disabled={loading}>
            {loading ? "Creating..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
