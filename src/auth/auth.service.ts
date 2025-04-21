import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
        const user = await this.auth.create({data});
        return user;
    }
}
