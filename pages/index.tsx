import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import TableComponent from "@/components/TableComponent";
import { Button } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import { CreateProductModal } from "@/components/CreateProductModal";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [refresh, setRefresh] = React.useState<any>(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  return (
    <>
      <CreateProductModal
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        setRefresh={setRefresh}
      />
      <div className="main-div">
        <div className="title-div">
          <h2 className="heading">Information Management Branch (IMB)</h2>
          <Button
            variant="contained"
            endIcon={<AiOutlinePlus />}
            onClick={() => setOpenCreate(true)}
            style={{ fontSize: "12px" }}
          >
            New Product
          </Button>
        </div>
        <div className="main-container">
          <TableComponent refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
    </>
  );
}
