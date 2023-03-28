import productData, { Product } from "@/data/productData";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  if (req.method === "GET") {
    res.status(200).json(productData);
  } else {
    res.status(405).end();
  }
}
