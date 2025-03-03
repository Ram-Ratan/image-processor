import { TStatus } from "@app/models/product";
import ProcessRequestRepository from "@app/repository/ProcessRequestRepository";

class GetStatusService {
  protected processRequestRepo: ProcessRequestRepository;
  constructor(processRequestRepository: ProcessRequestRepository) {
    this.processRequestRepo = processRequestRepository;
  }
  public async execute(id: string): Promise<TStatus> {
    const processRequest = await this.processRequestRepo.getById(id);
    if (!processRequest) {
        throw new Error("Process request not found");
    };
    return processRequest.status;
  }
}

export default GetStatusService;
