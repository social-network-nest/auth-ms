import { Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    constructor(
        private jwtService: JwtService,
    ) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async register(payload: any) {
        const {email, password, firstname, lastname} = payload;
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const auth = await this.auth.create({
            data: {
                email: email,
                password: hashedPassword,
            },
        });

        return await this.user.create({
            data: {
                firstName: firstname,
                lastName: lastname,
                authId: auth.id,
            },
        });
    }

    async findAuthByEmail(email: string) {
        return await this.auth.findUnique({
            where: { email },
        });
    }

    async findUserByAuthId(authId: string) {
        return await this.user.findUnique({
            where: { authId },
        });
    }

    async login(payload: any) {
        const {email, password} = payload;

        const auth = await this.findAuthByEmail(email);
        if (!auth) {
            throw new NotFoundException('User with this email does not exist');
        }

        const isPasswordValid = await bcrypt.compare(password, auth.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Incorrect password');
        }

        const user = await this.findUserByAuthId(auth.id);
        if (!user) {
            throw new NotFoundException('User profile not found');
        }

        return {
            Bearer: this.jwtService.sign({
                email: auth.email,
                userId: user.id,
            }),
        }
    }

    async verifyToken(token: string) {
        const decode = this.jwtService.verify(token);
        return {
            valid: true,
            decode: decode,
        }
    }

    async findUserById(id: any) {
        return await this.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            }
        })
    }

    async listUsers() {
        const user = await this.user.findMany()
        if (!user) {
            throw new NotFoundException('No users found');
        }
        return user;
    }
}
