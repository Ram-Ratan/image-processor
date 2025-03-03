import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fp from "fastify-plugin";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyMultipart from "@fastify/multipart";
import fastifySensible from "@fastify/sensible";

export default fp(async (app: FastifyInstance) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
  });
  app.register(cors);
  app.register(helmet);
  app.register(fastifySensible);
});