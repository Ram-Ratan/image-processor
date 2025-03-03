import { FastifyInstance, onRequestHookHandler } from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import fp from "fastify-plugin";
import { appEnv } from "@shared/constants/env";

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.register(fastifyRequestContext);
    fastify.decorate(
      "initializeRequestContext",
      function (request, reply, done) {
        request.requestContext.set("requestId", request.id);
        const firstAppName = appEnv.APP_NAME.split(" ")[0];
        const exisitingCallerChain = request.headers["caller-chain"];
        const newCallerChain =
          exisitingCallerChain && typeof exisitingCallerChain === "string"
            ? `${exisitingCallerChain}#${firstAppName}`
            : firstAppName;
        request.requestContext.set("logger", {
          callerChain: newCallerChain,
        });
        done();
      }
    );
  }
);

declare module "@fastify/request-context" {
  interface RequestContextData {
    logger: {
      callerChain: string;
    };
    requestId: string;
  }
}

declare module "fastify" {
  export interface FastifyInstance {
    initializeRequestContext: onRequestHookHandler;
  }
}
