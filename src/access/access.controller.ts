import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { UserService } from '../user/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateRoleDTO } from './dto/role.dto';
import { AuthUser } from '../shared/decorators/auth-user.decorator';

@Controller('access')
@ApiTags('access')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
export class AccessController {
  constructor(
    private readonly accessService: AccessService,
    private readonly userService: UserService,
  ) {}

  @Patch('/cooperativeRole')
  async updateRole(@Body() body: UpdateRoleDTO, @AuthUser() user: User) {
    await this.accessService.updateRole(body, user);
    return { message: 'Data updated successfully.' };
  }

  // @Get('/accessCredentials')
  // async fetchAccessCredentials(@AuthUser() user: User) {
  //   const cooperativeId = user.cooperative.id;
  //   const result = await this.accessService.findByCooperative(cooperativeId);
  //   return { message: 'fetched merchant data', data: { result } };
  // }

  // @Get('/fetchCooperativeGroupByRole')
  // async fetchGroupByRoles(@AuthUser() user: User) {
  //   const cooperativeId = user.cooperative.id;
  //   const result = await this.userService.findByCooperative(cooperativeId);

  //   return { message: 'fetched merchants and group by role', data: { result } };
  // }
}
