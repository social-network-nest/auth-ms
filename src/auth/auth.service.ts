import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
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
}
