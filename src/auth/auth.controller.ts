import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { JwtStrategy } from './passport/jwt.strategy';
import { IUser } from 'src/users/user.interface';
import { use } from 'passport';
import { RolesService } from 'src/roles/roles.service';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private rolesService: RolesService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post('/login')
    handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }


    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('register')
    registerUser(@Body() registerDTO: RegisterUserDto) {
        return this.usersService.registerUser(registerDTO)
    }

    @ResponseMessage("Get user information")
    @Get("account")
    async getAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions
        return { user }
    }

    @Public()
    @ResponseMessage("Get User by refresh token")
    @Get("refresh")
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refeshToken = request.cookies["refesh_token"];

        return this.authService.processNewToken(refeshToken, response)
    }


    @ResponseMessage("Logout User")
    @Post("logout")
    handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
        return this.authService.procesLogout(response, user)
    }

}
