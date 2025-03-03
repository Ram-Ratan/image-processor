import prisma from "@infra/prisma";
import { Product } from "@prisma/client";
import BaseRepository from "./BaseRepository";

class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma, "product");
  }
}

export default ProductRepository;