import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Patch,
  Query,
  Redirect,
  UnauthorizedException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
// import { ApikeyService } from './../apikey/apikey.service';
import {
  IHttpResponse,
  IJwtPayload,
  ILoginResponse,
  IResetPassword,
  ISignupResponse,
} from './auth.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from '../user/entities/roles.enum';
import { DbTransactionFactory } from '../shared/services/TransactionManager/TransactionManager';
import { AuthUser } from '../shared/decorators/auth-user.decorator';
import { ACGuard } from 'nest-access-control';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private serverUrl: string;
  private reactAppUrl: string;
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    // private apikeyService: ApikeyService,
    private readonly transactionRunner: DbTransactionFactory,
  ) {
    this.serverUrl = this.configService.get('serverAppUrl');
    this.reactAppUrl = this.configService.get('reactAppUrl');
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: User, description: 'Successfully Registered' })
  async registerUser(
    @Body() body: CreateUserDto,
  ): Promise<ISignupResponse | HttpException> {
    let transactionRunner = null;
    let user: User = null;
    try {
      transactionRunner = await this.transactionRunner.createTransaction();
      await transactionRunner.startTransaction();

      const transactionManager = transactionRunner.transactionManager;
      user = await this.userService.findOne({
        email: body.email,
      });

      if (user) {
        throw new BadRequestException('Credentials already in use');
      }

      const cooperativeName = await this.authService.findMerchant(
        body.cooperative_name,
      );
      if (cooperativeName) {
        throw new BadRequestException(
          'You can not create an account with this merchant name',
        );
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, salt);

      body.password = hashedPassword;

      user = await this.userService.create(body, transactionManager);

      // await this.sendBirdService.createAccount({
      //   userId: user.id,
      //   nickName: body.full_name,
      //   profileUrl: '',
      //   issueAccessToken: false,
      //   metadata: {
      //     role: Role.PRINCIPAL,
      //   },
      // });

      //REPLACE WITH OTP LOGIC

      // const link = await this.authService.generateEmailVerificationLink(
      //   user.email,
      // );
      

      // await this.mailjetService.sendEmailVerificationMail(
      //   user.email,
      //   user.full_name,
      //   link,
      // );

      await transactionRunner.commitTransaction();
      return { message: 'user account created successfully', user };
    } catch (error) {
      this.logger.error(error);
      if (transactionRunner) await transactionRunner.rollbackTransaction();
      // user && (await this.sendBirdService.deleteAccountOnRevert(user.id));
      throw new BadRequestException(error.message);
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully Registered' })
  async loginUser(
    @Body() body: loginUserDto,
  ): Promise<ILoginResponse | HttpException> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    if (!user.is_verified) {
      throw new UnauthorizedException('Kindly verify your account');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const access_token = await this.jwtService.sign(
      {
        username: user.email,
        sub: user.id,
      },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refresh_token = await this.jwtService.sign(
      { username: user.email },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '10days',
      },
    );

    return { message: 'login successful', user, refresh_token, access_token };
  }

  @Get('logout')
  logout() {
    return;
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, ACGuard)
  user(@AuthUser() user: User) {
    return this.authService.verifyUser(user);
  }

  @Redirect()
  @Get('verification/email')
  async verifyEmail(@Query('token') token: string) {
    const payload: IJwtPayload =
      await this.authService.verifyEmailVerificationToken(token);

    if (Date.now() >= payload.exp * 1000) {
      return {
        url: `${this.reactAppUrl}/resend-verification?email=${payload.email}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      };
    }

    await this.userService.update(
      { email: payload.email },
      { is_verified: true },
    );

    return {
      url: `${this.reactAppUrl}/login`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    };
  }

  @Redirect()
  @Get('verification/team/email')
  async verifyTeamEmail(@Query('token') token: string) {
    const payload: IJwtPayload =
      await this.authService.verifyAccessToken(token);

    if (payload) {
      return {
        url: `${this.reactAppUrl}/password/team-member/${token}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      };
    }
  }

  @Post('verification/resend-email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'resend email verification mail' })
  async resendEmailVerificationMail(
    @Body() body: { email: string },
  ): Promise<IHttpResponse> {
    const user = await this.userService.findByEmail(body.email);

    if (user.is_verified) {
      return { message: 'Account already verified' };
    }

    const link = await this.authService.generateEmailVerificationLink(
      user.email,
    );

    // await this.mailjetService.sendEmailVerificationMail(
    //   user.email,
    //   user.full_name,
    //   link,
    // );

    return { message: 'sent email verification mail' };
  }

  @Get('validate-user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async getUser(@AuthUser() user: User) {
    return user;
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async getPasswordResetMail(@Body() { email }: { email: string }) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User account not found');
    }

    const token = await this.authService.generateHash({ email });
    const link = `${this.configService.get<string>(
      'reactAppUrl',
    )}/password/${token}`;

  //   await this.mailjetService.forwardPasswordResetMail(
  //     user.email,
  //     user.full_name,
  //     link,
  //   );
  //   return { message: 'Password reset mail has been sent' };
  }

  @Patch('password-reset')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordReset(
    @Body() body: IResetPassword,
    @Query('token') token: string,
  ) {
    const verifyPayload = await this.authService.verifyHash(token);

    const { email, exp } = verifyPayload;
    const { password } = body;

    if (Date.now() >= exp * 1000) {
      throw new UnauthorizedException('Session token has expired');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userService.update({ email }, { password: hashedPassword });

    return { message: 'Password reset successful' };
  }
}
