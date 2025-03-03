import { TCSVRow, ZStatus } from "@app/models/product";
import ImageRepository from "@app/repository/ImageRepository";
import ProcessRequestRepository from "@app/repository/ProcessRequestRepository";
import ProductRepositoty from "@app/repository/ProductRepository";
import { v4 } from "uuid";

class UploadProductService {
  protected productRepo: ProductRepositoty;
  protected imageRepo: ImageRepository;
  protected processRequestRepo: ProcessRequestRepository;
  constructor(
    productRepository: ProductRepositoty,
    imageRepository: ImageRepository
  ) {
    this.productRepo = productRepository;
    this.imageRepo = imageRepository;
  }
  async execute(input: TCSVRow[]) {
    const requestId = v4();
    const res = await Promise.all(
      input.map(async (row) => {
        const product = await this.productRepo.create({
          id: v4(),
          name: row.productName,
          serialNo: row.serialNumber,
          requestId: requestId,
        });
        await Promise.all(
          row.inputImageUrls.map(async (url, index) => {
            return await this.imageRepo.create({
              inputUrl: url,
              status: ZStatus.Enum.PENDING,
              order: index,
              outputUrl: null,
              createdAt: new Date(),
              productId: product.id,
            });
          })
        );

        await this.processRequestRepo.create({
          id: requestId,
          status: ZStatus.enum.PENDING,
          createdAt: new Date(),
          finishedAt: null,
          webhookUrl: null,
        });
      })
    );
  }
}

export default UploadProductService;
