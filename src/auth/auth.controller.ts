import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
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

}
