import ImageRepository from '@app/repository/ImageRepository';
import ProcessRequestRepository from '@app/repository/ProcessRequestRepository';
import ProductRepository from '@app/repository/ProductRepository';
import GetStatusService from '@app/services/product/GetStatusService';
import UploadProductService from '@app/services/product/UploadProductService';
import fp from 'fastify-plugin';


export default fp(async (fastify) => {
    const repos = {
        product: new ProductRepository(),
        image: new ImageRepository(),
        processRequest: new ProcessRequestRepository()
    };

    fastify.decorate('services', {
        uploadProduct: new UploadProductService(repos.product, repos.image, repos.processRequest),
        getStatus: new GetStatusService(repos.processRequest)
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        services: {
            uploadProduct: UploadProductService;
            getStatus: GetStatusService;
        };
    }
}
