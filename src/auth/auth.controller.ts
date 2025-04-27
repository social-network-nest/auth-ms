import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  login(@Payload() payload: any) {
    return this.authService.login(payload);
  }
  @MessagePattern({ cmd: 'register' })
  register(@Payload() payload: any) {
    return this.authService.register(payload);
  }

  @MessagePattern({ cmd: 'verify.token' })
  verifyToken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern({ cmd: 'find.user.id' })
  findUserById(@Payload() id: string) {
    return this.authService.findUserById(id);
  }

  @MessagePattern({ cmd: 'list.users' })
  listUsers() {
    return this.authService.listUsers();
  }

}
