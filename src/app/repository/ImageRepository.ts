import prisma from "@infra/prisma";
import { Image } from "@prisma/client";
import BaseRepository from "./BaseRepository";

class ImageRepository extends BaseRepository<Image> {
  constructor() {
    super(prisma, "image");
  }
}

export default ImageRepository;