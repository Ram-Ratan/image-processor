import { appEnv } from "@shared/constants/env";

export const redisConnection = {
    host: appEnv.REDIS_HOST|| "127.0.0.1",
    port: appEnv.REDIS_PORT || 6379,
  };