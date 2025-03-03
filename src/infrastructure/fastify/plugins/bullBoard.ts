import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { imageQueue } from "@infra/queue/imageQueue";
import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

export default fp(async (app: FastifyInstance) => {
        const queues = [imageQueue];
    
        const serverAdapter = new FastifyAdapter();
    
        createBullBoard({
          queues: queues.map((q) => new BullMQAdapter(q)),
          serverAdapter,
        });
    
        serverAdapter.setBasePath("/ui");
        app.register(serverAdapter.registerPlugin(), {prefix: "/ui"});
});