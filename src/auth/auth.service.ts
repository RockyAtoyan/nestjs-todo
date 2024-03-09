import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { RegistrationDto } from './dto/registration.dto';
import { hashSync, compareSync } from 'bcrypt';
import { LibService } from '../lib/lib.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private lib: LibService,
  ) {}

  async registration(payload: RegistrationDto, image: Express.Multer.File) {
    try {
      const isIn = await this.prisma.user.findFirst({
        where: { name: payload.name },
      });
      if (isIn) {
        throw new BadRequestException('User with this name exists');
      }
      const password = hashSync(payload.password, 7);
      const id = uuid();
      const user = await this.prisma.user.create({
        data: {
          id,
          name: payload.name,
          password,
          image:
            image && image.size
              ? `http://localhost:3000/users-images/${id + '.' + image.originalname.split('.')[1]}`
              : null,
        },
      });
      if (!user) {
        throw new BadRequestException('Error');
      }
      if (image && image.size) {
        this.lib.saveUserImage(
          user.id + '.' + image.originalname.split('.')[1],
          image,
        );
      }
      return { id: user.id, name: user.name, image: user.image };
    } catch (e) {
      const error = e as Error;
      return { message: error.message };
    }
  }

  async login(res: Response, payload: LoginDto) {
    try {
      const candidate = await this.prisma.user.findFirst({
        where: { name: payload.name },
        include: {
          todo: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              tasks: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      });
      if (!candidate) {
        throw new BadRequestException('User with this name does not exists');
      }
      const isPassCompared = compareSync(payload.password, candidate.password);
      if (!isPassCompared) {
        throw new BadRequestException('Wrong password');
      }
      const tokens = this.lib.generateTokens({
        id: candidate.id,
        name: candidate.name,
      });

      res.cookie('accessToken', tokens.accessToken);
      const { password, ...user } = candidate;
      return { user };
    } catch (e) {
      const error = e as Error;
      return { message: error.message };
    }
  }

  logout(res: Response) {
    res.clearCookie('accessToken');
    return true;
  }

  async auth(req: Request) {
    const token = req.cookies.accessToken;
    if (!token) return { user: null };
    const payload = JSON.stringify(this.lib.verifyToken(token));
    const user = JSON.parse(payload);
    if (!user) {
      return { user: null };
    }
    const authUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        todo: {
          orderBy: {
            order: 'desc',
          },
          include: {
            tasks: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });
    return { user: authUser || null };
  }
}
