import Fastify from "fastify";
import errorHandlerPlugin from "@infra/fastify/error-handler";
import autoload from "@fastify/autoload";
import path from "path";
import { logger } from "@shared/logger";
import { appEnv } from "@shared/constants/env";

export class App {
  public app;

  constructor() {
    this.app = Fastify({ loggerInstance: logger.log });
    this.setupPlugins();
    this.setupRoutes();
    this.setUpErrorHandlers();
  }

  private setupPlugins() {
    this.app.register(autoload, {
      dir: path.join(__dirname, "infrastructure/fastify/plugins"),
      options: { prefix: "/plugins" },
    });
  }

  private setupRoutes() {
    this.app.register(autoload, {
      dir: path.join(__dirname, "app/routes"),
      options: { prefix: "/api/v1" },
    });
  }

  private setUpErrorHandlers() {
    this.app.setErrorHandler(errorHandlerPlugin);
  }

  public async start() {
    try {
      await this.app.listen({ port: appEnv.APP_PORT });
      logger.log.info(
        `🚀 Server running on http://localhost:${appEnv.APP_PORT}`
      );
    } catch (error) {
      logger.log.error(`❌ Error starting server: ${JSON.stringify(error)}`);
      process.exit(1);
    }
  }
}
