import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly client: ClientProxy,
    ) {}

    async listUsers() {
        return this.client.send({ cmd: 'list_users' }, {});
    }
}
