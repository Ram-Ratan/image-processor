import ProductRepository from '@app/repository/ProductRepository';
import UploadProductService from '@app/services/product/UploadProductService';
import fp from 'fastify-plugin';


export default fp(async (fastify) => {
    const repos = {
        product: new ProductRepository(),
    };

    fastify.decorate('services', {
        uploadProduct: new UploadProductService(repos.product)
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        services: {
            uploadProduct: UploadProductService;
        };
    }
}
