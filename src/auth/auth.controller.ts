import { Body, Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }


    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('register')
    registerUser(@Body() registerDTO: RegisterUserDto) {
        return this.usersService.registerUser(registerDTO)
    }

}
