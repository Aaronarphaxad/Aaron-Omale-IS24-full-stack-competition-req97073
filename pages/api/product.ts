import productData, { Product } from "@/data/productData";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseMessage = {
  message: string;
};

/**
 * It generates a random two-digit ID, checks if it already exists in the products array, and if it
 * does, it generates a new ID
 * @param {any[]} data - any[] - this is the array of products that we're checking against.
 * @returns the value of the variable newId.
 */
const generateProductId = (data: any[]): number => {
  let newId = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0"); // generate two-digit ID
  while (data.some((prod: { productId: string }) => prod.productId === newId)) {
    // check if ID already exists in products array
    newId = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0"); // generate new ID if it already exists
  }
  return parseInt(newId);
};

/**
 * It handles POST, DELETE, and PUT requests to the /api/products endpoint
 * @param {NextApiRequest} req - NextApiRequest - This is the request object. It contains information
 * about the request such as the HTTP method, headers, and query parameters.
 * @param res - NextApiResponse<Product | ResponseMessage>
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | ResponseMessage>
) {
  const { method, body } = req;

  const productId = parseInt(req.query.id as string);
  switch (method) {
    case "GET":
      const data = productData.find((data) => data.productId === productId);

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).end();
      }
      break;
    case "POST":
      try {
        const {
          productName,
          productOwnerName,
          Developers,
          scrumMasterName,
          methodology,
          startDate,
        } = req.body;

        const newProduct: Product = {
          productId: generateProductId(productData),
          productName,
          productOwnerName,
          Developers,
          scrumMasterName,
          methodology,
          startDate,
        };
        // Validate the request body
        if (
          !productName ||
          !productOwnerName ||
          !Developers ||
          !scrumMasterName ||
          !methodology ||
          !startDate
        ) {
          throw new Error("All fields are required");
        }
        productData.push(newProduct);

        res.status(201).json(newProduct);
      } catch (error) {
        res.status(400).json({ message: "An error occured" });
      }

      break;
    case "DELETE":
      const index = productData.findIndex((p) => p.productId === productId);
      if (index !== -1) {
        productData.splice(index, 1);
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Product not found" });
      }
      break;
    case "PUT":
      const productToUpdate = productData.find(
        (p) => p.productId === productId
      );
      if (productToUpdate) {
        const updatedProduct = req.body;
        const updatedProductIndex = productData.findIndex(
          (p) => p.productId === productId
        );
        productData[updatedProductIndex] = {
          ...productToUpdate,
          ...updatedProduct,
        };
        res.status(200).json(productData[updatedProductIndex]);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Retrieve a product
 *     description: Retrieve a product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     description: Create a new product
 *     requestBody:
 *       description: The product to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   put:
 *     summary: Update an existing product
 *     description: Update an existing product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       description: The updated product data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Delete an existing product
 *     description: Delete an existing product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: The product was successfully deleted
 *       404:
 *         description: The product was not found
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - productName
 *         - productOwnerName
 *         - Developers
 *         - scrumMasterName
 *         - startDate
 *         - methodology
 *       properties:
 *         productId:
 *           type: integer
 *         productName:
 *           type: string
 *         productOwnerName:
 *           type: string
 *         Developers:
 *           type: array
 *           items:
 *             type: string
 *         scrumMasterName:
 *           type: string
 *         startDate:
 *           type: string
 *         methodology:
 *           type: string
 *       example:
 *         productId: 41
 *         productName: Project Delta
 *         productOwnerName: David Wilson
 *         Developers:
 *           - Michelle Lee
 *           - Kevin Chen
 *           - Angela Davis
 *           - Jason Kim
 *           - Rebecca Nguyen
 *         scrumMasterName: Richard Johnson
 *         startDate: "2022/06/10"
 *         methodology: Agile
 */
