import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthCommon } from "../common/auth";
import { z } from "zod";
import { bufferToJson } from "@shared/utils/bufferToJson";
import { TCSVRow, ZCSVRow, ZStatus } from "@app/models/product";
import { logger } from "@shared/logger";
import { ValidationError } from "@shared/error/ValidationError";

const productRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/upload",
    schema: {
      body: z.object({
        file: z.any(),
      }),
      response: {
        200: z.object({
          requestId: z.string(),
        }),
      },
    },
    ...AuthCommon.RouteOptions,
    handler: async function (request, reply) {
      const { file } = request.body;
      if (!file || file.length === 0) {
        throw new ValidationError("Csv file required!");
      }

      let jsonData;
      try {
        jsonData = await bufferToJson(file);
      } catch (error) {
        throw new ValidationError("Invalid CSV format!");
      }

      const requiredHeaders = ["S. No.", "Product Name", "Input Image Urls"];
      const fileHeaders = Object.keys(jsonData[0] || {});
      const missingHeaders = requiredHeaders.filter(
        (header) => !fileHeaders.includes(header)
      );
      if (missingHeaders.length > 0) {
        throw new ValidationError(
          `Missing headers: ${missingHeaders.join(", ")}`
        );
      }
      let parsedRows: TCSVRow[];
      try {
        parsedRows = jsonData.map((row) =>
          ZCSVRow.parse({
            serialNumber: row["S. No."],
            productName: row["Product Name"],
            inputImageUrls: row["Input Image Urls"],
          })
        );
      } catch (error) {
        throw new ValidationError(`${error.error}`);
      }

      logger.log.info(`Data: ${JSON.stringify(parsedRows)}`);

      const requestId = await fastify.services.uploadProduct.execute(
        parsedRows
      );
      return { requestId };
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/get-status/:requestId",
    schema: {
      params: z.object({
        requestId: z.string(),
      }),
      response: {
        200: z.object({
          status: ZStatus,
        }),
      },
    },
    ...AuthCommon.RouteOptions,
    handler: async function (request, reply) {
      const { requestId } = request.params;
      const status = await fastify.services.getStatus.execute(requestId);
      return { status };
    },
  });
};

export default productRoutes;
