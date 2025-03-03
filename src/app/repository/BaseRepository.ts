import { PrismaClient } from "@prisma/client";

class BaseRepository<T extends { id?: string }> {
  protected prismaModel: any;
  protected prisma: PrismaClient;
  constructor(prisma: PrismaClient, modelName: keyof PrismaClient) {
    if (!prisma) throw new Error("Prisma client is required");
    if (!modelName) throw new Error("Model name is required");
    this.prisma = prisma;
    this.prismaModel = prisma[modelName];
  }


  getById(id: string): Promise<T | null> {
    return this.prismaModel.findUnique({ where: { id } });
  }

  create = async (entity: Omit<T, "id"> & { id?: string }): Promise<T> => {
    return await this.prismaModel.create({ data: entity });
  };

  updateByID = async (
    id: string,
    entity: Partial<Omit<T, "id">>
  ): Promise<T> => {
    return await this.prismaModel.update({
      where: { id: id },
      data: entity,
    });
  };

  deleteByID = async (id: string): Promise<any> => {
    return await this.prismaModel.delete({ where: { id: id } });
  };
}

export default BaseRepository;
