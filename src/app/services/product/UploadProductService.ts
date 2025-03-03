import ProductRepositoty from "@app/repository/ProductRepository";

class UploadProductService {
    protected productRepo: ProductRepositoty;
    constructor(productRepository: ProductRepositoty) {
        this.productRepo = productRepository;
    }
    async execute(data: any) {
        //implentation
    }
}

export default UploadProductService;