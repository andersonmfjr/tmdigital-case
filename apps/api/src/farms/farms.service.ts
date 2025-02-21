import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: number;
    propertyName: string;
    location: string;
    sector: string;
    creditReason: string;
  }) {
    const existingFarm = await this.prisma.farm.findUnique({
      where: { userId: data.userId },
    });

    if (existingFarm) {
      throw new ConflictException(
        'Usuário já possui uma propriedade registrada'
      );
    }

    return this.prisma.farm.create({
      data,
    });
  }

  async findByUserId(userId: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { userId },
    });

    if (!farm) {
      throw new NotFoundException(
        'Propriedade não encontrada para este usuário'
      );
    }

    return farm;
  }

  async findById(id: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!farm) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    const { user, ...farmData } = farm;
    const { password, ...userData } = user;

    return {
      ...farmData,
      user: userData,
    };
  }
}
