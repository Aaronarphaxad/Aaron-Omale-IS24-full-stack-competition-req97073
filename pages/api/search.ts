import productData from "@/data/productData";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * It filters the productData array based on the searchBy and name parameters
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns An array of objects.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const { searchBy, name } = query;

  if (!searchBy || !name) {
    return res
      .status(400)
      .json({ error: "Both searchBy and name are required parameters." });
  }

/* Filtering the productData array based on the searchBy and name parameters. */
  const filteredProducts = productData.filter((product) => {
    if (searchBy === "developer") {
      const searchName = Array.isArray(name) ? name.join(" ") : name;
      return product.Developers.some((dev) =>
        dev.toLowerCase().includes(searchName)
      );
    } else if (searchBy === "scrumMaster") {
      const searchName = Array.isArray(name) ? name.join(" ") : name;
      return product.scrumMasterName.toLowerCase().includes(searchName);
    } else {
      return false;
    }
  });

  res.status(200).json(filteredProducts);
}



/**
 * @swagger
 * /api/search:
 *   get:
 *     description: Returns a list of products filtered by developer or scrum master name
 *     parameters:
 *       - in: query
 *         name: searchBy
 *         required: true
 *         description: Type of search (developer or scrumMaster)
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: true
 *         description: Name to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Both searchBy and name are required parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Both searchBy and name are required parameters."
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         name:
 *           type: string
 *           example: "Product A"
 *         Developers:
 *           type: array
 *           items:
 *             type: string
 *             example: "John Doe"
 *         scrumMasterName:
 *           type: string
 *           example: "Jane Doe"
 */
