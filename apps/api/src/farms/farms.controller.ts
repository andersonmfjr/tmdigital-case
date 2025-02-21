import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createFarmDto: {
      propertyName: string;
      location: string;
      sector: string;
      creditReason: string;
    },
  ) {
    return this.farmsService.create({
      userId: req.user.id,
      ...createFarmDto,
    });
  }

  @Get('my-farm')
  async findMyFarm(@Request() req: { user: { id: number } }) {
    return this.farmsService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.farmsService.findById(Number(id));
  }
}