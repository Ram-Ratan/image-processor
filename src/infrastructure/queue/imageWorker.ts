import { Worker, Job } from "bullmq";
import prisma from "@infra/prisma";
import { ZStatus } from "@app/models/product";
import { redisConnection } from "./redis";
import axios from "axios";
import sharp from "sharp";
import { uploadFile } from "@infra/s3";

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

      // const outputUrl = await uploadFile({file: compressedBuffer, mimeType: 'jpeg', fileName: `/${requestId}/${imageId}/compressed`});
      const outputUrl = `https://example.com/${requestId}/${imageId}/compressed`;

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
