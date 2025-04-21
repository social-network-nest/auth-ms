import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ cmd: 'login_user' })
  loginUser() {
    return this.userService.listUsers();
  }
  @MessagePattern({ cmd: 'register' })
  register() {
    return this.authService.register();
  }
}
