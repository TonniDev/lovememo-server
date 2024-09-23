import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PostgresErrorCode } from '../db/postgresErrorCodes.enum';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import { AuthStrategy } from './enums';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async registerSocial(registrationData: RegisterDto, social: AuthStrategy) {
    if (!social && !registrationData.password) {
      throw new HttpException('Invalid request: missing fields', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findByEmail(registrationData.email);

    if (user) {
      /** User exists and already connected this social account. Redirect user to login. */
      if (user.oauth_providers?.includes(social)) {
        throw new HttpException(
          'Account already registered. Proceed to login.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        /** User exists but doesn't have this social account connected */
        /** Update existing user with social info and log in. */
        const existingUser = this.populateUserDataBySocialProvider(
          {
            email: user.email,
            name: user.name,
            oauth_info: { ...user.oauth_info },
            oauth_providers: [...(user?.oauth_providers || []), social],
          },
          registrationData,
          social,
        );
        try {
          const updatedUser = await this.usersService.update(user.id, existingUser);
          const cookie = this.getCookieWithJwtToken(user.id);
          return { cookie, user: updatedUser };
        } catch (error) {
          console.error(error);
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }
    /** User doesn't exist, so create a new account and log in user. */
    const newUser = {
      email: registrationData.email,
      name: registrationData.name,
      username: registrationData.email,
      oauth_id: registrationData.providerId,
      oauth_providers: [social],
      oauth_info: { g: registrationData },
    };
    try {
      const createdUser = await this.usersService.create(newUser);
      const cookie = this.getCookieWithJwtToken(createdUser.id);
      return { cookie, user: createdUser };
    } catch (error: any) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        let msg = 'User with that email already exists';
        if (error.detail.includes('username')) {
          msg = 'User with that username already exists';
        }
        throw new HttpException(msg, HttpStatus.BAD_REQUEST);
      }
      console.error(error);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async registerLocal(registrationData: RegisterDto) {
    let password = undefined;
    if (registrationData.password) {
      password = await bcrypt.hash(registrationData.password, 12);
    }

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error: any) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        let msg = 'User with that email already exists';
        if (error.detail.includes('username')) {
          msg = 'User with that username already exists';
        }
        throw new HttpException(msg, HttpStatus.BAD_REQUEST);
      }
      console.error(error);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.getUserByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (_error: any) {
      if (_error.message === 'not found') {
        throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  private async getUserByEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      return user;
    }
    throw new Error('not found');
  }

  private populateUserDataBySocialProvider(
    existingUser: RegisterDto,
    registrationData: RegisterDto,
    social: AuthStrategy,
  ) {
    // TODO: implement update for the other social strategies (Facebook, LinkedIn and Apple)
    if (social === AuthStrategy.GOOGLE) {
      existingUser.oauth_id = registrationData.providerId;
      existingUser.oauth_info = { ...existingUser.oauth_info, g: registrationData };
      if (!existingUser.name) {
        existingUser.name = registrationData.name;
      }
    }
    return existingUser;
  }
}
