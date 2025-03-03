import prisma from "@infra/prisma";
import { ProcessingRequest } from "@prisma/client";
import BaseRepository from "./BaseRepository";

class ProcessRequestRepository extends BaseRepository<ProcessingRequest> {
  constructor() {
    super(prisma, "processingRequest");
  }
}

export default ProcessRequestRepository;