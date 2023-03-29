import React, { FC, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Product } from "../data/productData";
import { headers } from "../data/productData";
import ProductModal from "./ProductModal";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillProfile,
  AiOutlineUser,
  AiFillSecurityScan,
} from "react-icons/ai";
import { DeleteProductModal } from "./DeleteProductModal";
import { InputAdornment } from "@mui/material";

interface MyPageProps {
  refresh: boolean;
  setRefresh: (prev: any) => void;
}

const TableComponent: FC<MyPageProps> = ({ refresh, setRefresh }) => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [productData, setProductData] = React.useState([]);
  const [dataToSend, setDataToSend] = React.useState<Product>();
  const [dataToDelete, setDataToDelete] = React.useState<Product | any>();
  const [developer, setDeveloper] = React.useState<string>("");
  const [scrumMaster, setScrumMaster] = React.useState<string>("");
  const [activeSearchBar, setActiveSearchBar] =
    React.useState<string>("developer");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  // Pagination functions
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  /**
   * It sets the active search bar to the searchBy parameter, and if the searchBy parameter is
   * "developer", it sets the scrumMaster state to an empty string, and if the searchBy parameter is
   * "scrumMaster", it sets the developer state to an empty string
   * @param {"developer" | "scrumMaster"} searchBy - "developer" | "scrumMaster"
   */
  const handleSetActiveSearchBar = (searchBy: "developer" | "scrumMaster") => {
    setActiveSearchBar(searchBy);
    if (searchBy === "developer") {
      setScrumMaster("");
    } else {
      setDeveloper("");
    }
  };

  /* Fetching data from the backend and setting the state of the productData. */
  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductData(data);
      // console.log(data);
    }
    /**
     * It takes the developer name from the input field and sends it to the backend to search for the
     * developer
     */
    const handleSearchDeveloper = async () => {
      // setScrumMaster("");
      const res = await fetch(
        `/api/search?searchBy=developer&name=${developer}`
      );
      const data = await res.json();
      setProductData(data);
    };

    /**
     * It takes the value of the scrumMaster input field and uses it to make a fetch request to the
     * backend. The backend then returns a list of products that match the scrumMaster name
     */
    const handleSearchScrum = async () => {
      // setDeveloper("");
      const res = await fetch(
        `/api/search?searchBy=scrumMaster&name=${scrumMaster}`
      );
      const data = await res.json();
      setProductData(data);
    };

    if (developer) {
      handleSearchDeveloper();
    } else if (scrumMaster) {
      handleSearchScrum();
    } else {
      fetchData();
    }
  }, [refresh, developer, scrumMaster]);

  /* A memoized function that returns the productData sliced from the startIndex to the endIndex. */
  const paginatedProductData = useMemo(() => {
    return productData.slice(startIndex, endIndex);
  }, [startIndex, endIndex, productData]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ProductModal
        open={open}
        handleClose={handleClose}
        data={dataToSend}
        setDataToSend={setDataToSend}
        setRefresh={setRefresh}
      />
      <DeleteProductModal
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        data={dataToDelete}
        setRefresh={setRefresh}
      />
      <div className="search-div">
        <TextField
          id="input-with-icon-textfield"
          label="Search by Developer"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiOutlineUser />
              </InputAdornment>
            ),
          }}
          value={developer}
          variant="standard"
          onChange={(e) => setDeveloper(e.target.value)}
          onClick={() => handleSetActiveSearchBar("developer")}
        />
        <TextField
          id="input-with-icon-textfield"
          label="Search by Scrum Master"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiOutlineUser />
              </InputAdornment>
            ),
          }}
          value={scrumMaster}
          variant="standard"
          onChange={(e) => setScrumMaster(e.target.value)}
          onClick={() => handleSetActiveSearchBar("scrumMaster")}
        />
      </div>

      {productData.length > 0 && (
        <>
          <TableContainer sx={{ maxHeight: 650 }}>
            <Table stickyHeader aria-label="customized table">
              <TableHead>
                <TableRow>
                  <></>
                  {headers.map((data) => (
                    <TableCell
                      key={data}
                      align={"left"}
                      style={{
                        minWidth: 5,
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "black",
                      }}
                    >
                      {data}
                    </TableCell>
                  ))}
                  <TableCell
                    style={{
                      minWidth: 5,
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "black",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProductData?.map((row: Product) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.productId}
                      style={{ cursor: "pointer" }}
                    >
                      {Object.entries(row).map(([field, value]) => {
                        return (
                          <TableCell
                            key={field}
                            align={"left"}
                            style={{ textTransform: "capitalize" }}
                          >
                            {field === "Developers" ? value?.join(", ") : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <div className="actions">
                          <AiFillEdit
                            onClick={() => {
                              setDataToSend(row);
                              setOpen(true);
                            }}
                            style={{ fontSize: "18px" }}
                          />
                          <AiFillDelete
                            style={{ fontSize: "15px" }}
                            onClick={() => {
                              setDataToDelete(row);
                              handleOpenDelete();
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={productData?.length}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {productData.length <= 0 && (
        <div className="not-found">
          Sorry, not found. <AiFillSecurityScan />
        </div>
      )}
    </Paper>
  );
};

export default TableComponent;
