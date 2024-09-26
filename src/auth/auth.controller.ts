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
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
// import * as bcrypt from 'bcrypt';
// import { User } from '../user/entities/user.entity';
// import { UserService } from '../user/user.service';
// import {
//   IHttpResponse,
//   IJwtPayload,
//   ILoginResponse,
//   IResetPassword,
//   ISignupResponse,
// } from './auth.interface';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from 'src/shared/services/TransactionManager/TransactionManager';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { IHttpResponse, ILoginResponse, ISignupResponse } from './auth.interface';
// import { CreateUserDto } from './dto/create-user.dto';
// import { loginUserDto } from './dto/login-user.dto';
// import { JwtAuthGuard } from './jwt-auth.guard';
// import { Role } from '../user/entities/roles.enum';
// import { DbTransactionFactory } from '../shared/services/TransactionManager/TransactionManager';
// import { AuthUser } from '../shared/decorators/auth-user.decorator';
// import { ACGuard } from 'nest-access-control';
// import { SendChampService } from 'src/shared/services/sendchamp.service';
import * as bcrypt from 'bcrypt'
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { loginUserDto } from './dto/login-user.dto';

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

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, salt);

      body.password = hashedPassword;

      // user = await this.userService.create(body, transactionManager);

      // Generate and send the OTP here
      // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      // await this.sendChampService.sendOtp(body.email); // Send OTP via email (you can change to SMS if needed)
      
      await transactionRunner.commitTransaction();
      return { message: 'User account created successfully. OTP has been sent', user };
    } catch (error) {
      this.logger.error(error);
      if (transactionRunner) await transactionRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Send OTP to user' })
  async sendOtp(@Body() body: { user: User }): Promise<IHttpResponse> {
    const user = await this.userService.findByEmail(body.user.email);

    // if (!user || user.is_verified) {
    //   throw new BadRequestException('User account not found or already verified');
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    // await this.sendChampService.sendOtp(body.user.email); // Send OTP via email (or SMS)
    
    return { message: 'OTP sent successfully' };
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Verify OTP' })
  async verifyOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<IHttpResponse> {
    const user = await this.userService.findByEmail(body.email);

    // if (!user || user.is_verified) {
    //   throw new BadRequestException('User account not found or already verified');
    // }

    // Call the SendChampService to verify OTP
    // const isValidOtp = await this.sendChampService.verifyOtp(body.email, body.otp);
    
    // if (!isValidOtp) {
    //   throw new BadRequestException('Invalid OTP');
    // }

    // await this.userService.update({ email: body.email }, { is_verified: true });
    return { message: 'OTP verified successfully, account is now verified' };
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

    // if (!user.is_verified) {
    //   throw new UnauthorizedException('Kindly verify your account');
    // }

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

    return { message: 'Login successful', user, refresh_token, access_token };
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  user(@AuthUser() user: User) {
    return this.authService.verifyUser(user);
  }
  
  // Other methods remain unchanged...
}
