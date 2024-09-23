import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { AuthStrategy } from './enums';
import { GoogleOauthGuard } from './googleOAuth.guard';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.registerLocal(registrationData);
  }

  @HttpCode(200)
  @Post('log-in')
  @UseGuards(LocalAuthenticationGuard)
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // biome-ignore lint/suspicious/noEmptyBlockStatements: This is just the entry point to the Google OAuth flow
  async auth() {}

  @Get('g/return')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { cookie, user } = await this.authenticationService.registerSocial(
      req.user,
      AuthStrategy.GOOGLE,
    );
    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return res.send(user);
  }

  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() _request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @Get('verify')
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
