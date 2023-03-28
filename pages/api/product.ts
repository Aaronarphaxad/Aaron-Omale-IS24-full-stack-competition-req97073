import productData, { Product } from "@/data/productData";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      const { id } = body;
      const data = productData.find((data) => data.productId === id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).end();
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
