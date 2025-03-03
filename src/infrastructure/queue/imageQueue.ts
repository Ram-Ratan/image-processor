import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const imageQueue = new Queue("image-processing", {
  connection: redisConnection,
});