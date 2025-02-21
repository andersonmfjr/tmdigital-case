import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:email')
  async getProfile(@Param('email') email: string) {
    const user = await this.usersService.findByUsername(email);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
