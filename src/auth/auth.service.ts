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
        const {email, password} = payload;
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await this.auth.create({
            data: {
                email: email,
                password: hashedPassword,
            },
        });
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

        return {
            Bearer: this.jwtService.sign(user),
        }
    }
}
