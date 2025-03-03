import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthCommon } from "../common/auth";
import { z } from "zod";
import { bufferToJson } from "@shared/utils/bufferToJson";
import { TCSVRow, ZCSVRow } from "@app/models/product";

const productRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/upload",
    schema: {
      body: z.object({
        file: z.any(),
      }),
      response: {
        200: z.any(),
      },
    },
    ...AuthCommon.RouteOptions,
    handler: async function (request, reply) {
      const { file } = request.body; 
      if (!file || file.length === 0) {
        return reply.status(400).send({ error: "CSV file is required." });
      }

      let jsonData;
      try {
        jsonData = await bufferToJson(file); 
      } catch (error) {
        return reply.status(400).send({ error: "Invalid CSV format." });
      }

      const requiredHeaders = ["S. No.", "Product Name", "Input Image Urls"];
      const fileHeaders = Object.keys(jsonData[0] || {});
      const missingHeaders = requiredHeaders.filter(
        (header) => !fileHeaders.includes(header)
      );
      if (missingHeaders.length > 0) {
        return reply
          .status(400)
          .send({ error: `Missing headers: ${missingHeaders.join(", ")}` });
      }
      let parsedRows:TCSVRow[];
      try {
        parsedRows = jsonData.map((row) =>
          ZCSVRow.parse({
            serialNumber: row["S. No."],
            productName: row["Product Name"],
            inputImageUrls: row["Input Image Urls"],
          })
        );
      } catch (error) {
        return reply.status(400).send({ error: error.errors });
      }

      const updateRes = await fastify.services.uploadProduct.execute(parsedRows);
      return updateRes;
    },
  });
};

export default productRoutes;
