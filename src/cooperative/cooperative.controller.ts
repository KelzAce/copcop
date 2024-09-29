import { Controller, Post, Body, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/user.role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cooperative')
@Controller('cooperative')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PRESIDENT)
export class CooperativeController {
  constructor(private readonly cooperativeService: CooperativeService) {}

  // Add a new member by email
  // @Post('add-member')
  // async addMember(@Body('email') email: string, @Req() req: any) {
  //   const cooperativeId = req.user.cooperativeId;
  //   return this.cooperativeService.addMember(cooperativeId, email);
  // }

  // Upload a CSV to add multiple members
  // @Post('upload-members')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads/csv',
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //       const ext = extname(file.originalname);
  //       // callback(null, `${req.user.cooperativeId}-${uniqueSuffix}${ext}`);
  //     },
  //   }),
  // }))
  // async uploadMembers(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
  //   const cooperativeId = req.user.cooperativeId;
  //   return this.cooperativeService.uploadMembersFromCsv(cooperativeId, file.path);
  // }

  // Send invitation to a member
  // @Post('send-invite')
  // async sendInvite(@Body('email') email: string, @Req() req: any) {
  //   const cooperativeId = req.user.cooperativeId;
  //   return this.cooperativeService.sendInvite(cooperativeId, email);
  // }
}
