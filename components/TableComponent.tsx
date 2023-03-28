import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Product } from "../data/productData";
import { headers } from "../data/productData";
import ProductModal from "./ProductModal";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

interface MyPageProps {
  productData: Product[];
}

export default function TableComponent() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [productData, setProductData] = React.useState([]);
  const [dataToSend, setDataToSend] = React.useState<number>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* Fetching data from the backend and setting the state of the productData. */
  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductData(data);
    }
    fetchData();
  }, [refresh]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ProductModal
        open={open}
        handleClose={handleClose}
        productId={dataToSend}
        setRefresh={setRefresh}
      />
      <TableContainer sx={{ maxHeight: 500 }}>
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
            {productData?.map((row: Product) => {
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
                        {field === "Developers" ? value.join(", ") : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="actions">
                      <AiFillEdit
                        onClick={() => {
                          setDataToSend(row.productId);
                          setOpen(true);
                        }}
                        style={{ fontSize: "18px" }}
                      />
                      <AiFillDelete style={{ fontSize: "15px" }} />
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
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
