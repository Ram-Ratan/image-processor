import { PrismaClient, Prisma } from "@prisma/client";

class BaseRepository<T extends { id?: string }> {
  protected prismaModel: any;
  protected prisma: PrismaClient;
  protected modelName: keyof PrismaClient;
  constructor(prisma: PrismaClient, modelName: keyof PrismaClient) {
    if (!prisma) throw new Error("Prisma client is required");
    if (!modelName) throw new Error("Model name is required");
    this.prisma = prisma;
    this.prismaModel = prisma[modelName];
    this.modelName = modelName;
  }

  private getModel(tx?: Prisma.TransactionClient) {
    return tx ? tx[this.modelName] : this.prismaModel;
  }

  getById(id: string, tx?: Prisma.TransactionClient): Promise<T | null> {
    return this.getModel(tx).findUnique({ where: { id } });
  }

  create = async (
    entity: Omit<T, "id"> & { id?: string },
    tx?: Prisma.TransactionClient
  ): Promise<T> => {
    return await this.getModel(tx).create({ data: entity });
  };

  createMany = async (
    entities: Array<Omit<T, "id"> & { id?: string }>,
    tx?: Prisma.TransactionClient
  ): Promise<T[]> => {
    return await this.getModel(tx).createMany({ data: entities });
  };

  updateByID = async (
    id: string,
    entity: Partial<Omit<T, "id">>,
    tx?: Prisma.TransactionClient
  ): Promise<T> => {
    return await this.getModel(tx).update({
      where: { id: id },
      data: entity,
    });
  };

  deleteByID = async (
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<any> => {
    return await this.getModel(tx).delete({ where: { id: id } });
  };
}

export default BaseRepository;
