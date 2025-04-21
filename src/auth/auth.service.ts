import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async register() {
        const data = {
            email: 'mjaral@outlook.com',
            password: '123456',
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        const user = await this.auth.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });
        return user;
    }
}
