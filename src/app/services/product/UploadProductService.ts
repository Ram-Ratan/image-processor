import { TCSVRow, ZStatus } from "@app/models/product";
import ImageRepository from "@app/repository/ImageRepository";
import ProcessRequestRepository from "@app/repository/ProcessRequestRepository";
import ProductRepositoty from "@app/repository/ProductRepository";
import prisma from "@infra/prisma";
import { v4 } from "uuid";

class UploadProductService {
  protected productRepo: ProductRepositoty;
  protected imageRepo: ImageRepository;
  protected processRequestRepo: ProcessRequestRepository;
  constructor(
    productRepository: ProductRepositoty,
    imageRepository: ImageRepository,
    processRequestRepository: ProcessRequestRepository
  ) {
    this.productRepo = productRepository;
    this.imageRepo = imageRepository;
    this.processRequestRepo = processRequestRepository;
  }
  async execute(input: TCSVRow[]) {
    const requestId = v4();

    await prisma.$transaction(async (tx) => {
      await this.processRequestRepo.create(
        {
          id: requestId,
          status: ZStatus.enum.PENDING,
          createdAt: new Date(),
          finishedAt: null,
          webhookUrl: null,
        },
        tx
      );

      await Promise.all(
        input.map(async (row) => {
          const product = await this.productRepo.create(
            {
              id: v4(),
              name: row.productName,
              serialNo: row.serialNumber,
              requestId: requestId,
            },
            tx
          );

          await Promise.all(
            row.inputImageUrls.map(async (url, index) => {
              return await this.imageRepo.create(
                {
                  inputUrl: url,
                  status: ZStatus.Enum.PENDING,
                  order: index,
                  outputUrl: null,
                  createdAt: new Date(),
                  productId: product.id,
                },
                tx
              );
            })
          );
        })
      );
    });
    return requestId;
  }
}

export default UploadProductService;
