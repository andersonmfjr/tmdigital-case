import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: {
    id: number;
    username: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const payload = { username: user.username, sub: user.id };

    const farm = await this.prisma.farm.findUnique({
      where: { userId: user.id },
    });

    const { id, username, name, createdAt, updatedAt } = user;
    const userData = {
      id,
      username,
      name,
      createdAt,
      updatedAt,
      hasCompletedOnboarding: !!farm,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }
}
