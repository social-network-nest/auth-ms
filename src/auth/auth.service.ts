import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    constructor(private jwtService: JwtService) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async register(payload: any) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        const user = await this.auth.create({
            data: {
                email: payload.email,
                password: hashedPassword,
            },
        });
        return user;
    }

    async findUserByEmail(email: string) {
        return await this.auth.findUnique({
            where: {
                email: email,
            },
        });
    }

    async login(payload: any) {
        const {email, password} = payload;

        const user = await this.findUserByEmail(email);
        if (!user) throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid password');

        const generateToken = this.jwtService.sign(user);

        return {
            Bearer: generateToken,
        }

    }
}
