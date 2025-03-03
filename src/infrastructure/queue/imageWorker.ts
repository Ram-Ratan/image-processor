import { Worker, Job } from "bullmq";
import prisma from "@infra/prisma";
import { ZStatus } from "@app/models/product";
import { redisConnection } from "./redis";
import axios from "axios";
import sharp from "sharp";

const imageWorker = new Worker(
  "image-processing",
  async (job: Job) => {
    const { imageId, inputUrl, requestId } = job.data;

    try {
      console.log(`Processing image: ${imageId}`);

      const imageResponse = await axios({
        url: inputUrl,
        responseType: "arraybuffer",
      });

      const compressedBuffer = await sharp(imageResponse.data)
        .jpeg({ quality: 50 })
        .toBuffer();

      // Abstracted image upload (To be implemented)
      //   const outputUrl = await uploadToStorage(inputUrl);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`Image processed: ${imageId}`);

      const outputUrl = inputUrl + "-processed";

      await prisma.image.update({
        where: { id: imageId },
        data: {
          status: ZStatus.enum.COMPLETED,
          outputUrl: outputUrl,
        },
      });

      console.log(`Image processed: ${imageId}`);

      const pendingImages = await prisma.image.count({
        where: {
          product: {
            request: {
              id: requestId,
            },
          },
          status: ZStatus.enum.PENDING,
        },
      });

      if (pendingImages === 0) {
        console.log(`All images processed for request: ${requestId}`);

        // Mark request as completed
        await prisma.processingRequest.update({
          where: { id: requestId },
          data: {
            status: ZStatus.enum.COMPLETED,
            finishedAt: new Date(),
          },
        });

        // TODO: Trigger webhook (To be implemented)
      }
    } catch (error) {
      console.error(`Error processing image ${imageId}:`, error);
      await prisma.image.update({
        where: { id: imageId },
        data: { status: ZStatus.enum.FAILED },
      });
    }
  },
  {
    connection: redisConnection,
  }
);

export default imageWorker;
