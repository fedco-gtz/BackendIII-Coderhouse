import fs from "fs";
import path from "path";

const productsFilePath = path.resolve("./src/data/products.json");

export const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
};

export const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};
