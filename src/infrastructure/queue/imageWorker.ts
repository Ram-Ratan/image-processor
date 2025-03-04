import { Worker, Job } from "bullmq";
import prisma from "@infra/prisma";
import { ZStatus } from "@app/models/product";
import { redisConnection } from "./redis";
import axios from "axios";
import sharp from "sharp";
import { uploadFile } from "@infra/s3";
import { logger } from "@shared/logger";

const getPendingImages = async (requestId: string) => {
  return await prisma.image.count({
    where: {
      product: {
        request: {
          id: requestId,
        },
      },
      status: ZStatus.enum.PENDING,
    },
  });
};

const onAllImagesProcessed = async (requestId: string) => {
  const pendingImages = await getPendingImages(requestId);
  if (pendingImages === 0) {
    console.log(`All images processed for request: ${requestId}`);

    // Mark request as completed
    const res = await prisma.processingRequest.update({
      where: { id: requestId },
      data: {
        status: ZStatus.enum.COMPLETED,
        finishedAt: new Date(),
      },
    });

    // TODO: Trigger webhook (To be implemented)
    try {
      if (res.webhookUrl) {
        await axios.post(res.webhookUrl, {
          requestId: requestId,
          status: ZStatus.enum.COMPLETED,
          finishedAt: res.finishedAt,
        });
      }
    } catch (err) {
      logger.log.error(
        `Error triggering webhook for request: ${requestId}: err ${err}`
      );
    }
  }
};

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
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const outputUrl = `https://example.com/${requestId}/${imageId}/compressed`;

      await prisma.image.update({
        where: { id: imageId },
        data: {
          status: ZStatus.enum.COMPLETED,
          outputUrl: outputUrl,
        },
      });

      console.log(`Image processed: ${imageId}`);
      await onAllImagesProcessed(requestId);
    } catch (error) {
      console.error(`Error processing image ${imageId}:`, error);
      await prisma.image.update({
        where: { id: imageId },
        data: { status: ZStatus.enum.FAILED },
      });
      await onAllImagesProcessed(requestId);
    }
  },
  {
    connection: redisConnection,
  }
);

export default imageWorker;
