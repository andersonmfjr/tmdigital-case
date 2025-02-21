import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
