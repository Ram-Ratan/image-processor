import { z } from "zod";
export const ZProduct = z.object({
  id: z.string(),
  requestId: z.string(),
  name: z.string(),
  serialNo: z.string(),
});

export type TProduct = z.infer<typeof ZProduct>;

export const ZImage = z.object({
  id: z.string(),
  productId: z.string(),
  inputUrl: z.string(),
  outputUrl: z.string(),
  status: z.string(),
  order: z.number(),
  createdAt: z.date(),
});

export type TImage = z.infer<typeof ZImage>;

export const ZProcessingRequest = z.object({
  id: z.string(),
  createdAt: z.date(),
  finishedAt: z.date().nullable(),
  status: z.string(),
  webhookUrl: z.string().nullable(),
});

export type TProcessingRequest = z.infer<typeof ZProcessingRequest>;

export const ZStatus = z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]);
export type TStatus = z.infer<typeof ZStatus>;

export const ZCSVHeaders = z.enum([
  "S. No.",
  "Product Name",
  "Input Image Urls",
]);

export const ZCSVRow = z.object({
  serialNumber: z.coerce.number().positive(),
  productName: z.string().min(1),
  inputImageUrls: z
    .string()
    .min(1)
    .transform((val) => val.split(",").map((url) => url.trim())),
});

export type TCSVRow = z.infer<typeof ZCSVRow>;
