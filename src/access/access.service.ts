import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from './entities/access.entity';
import { User } from '../user/entities/user.entity';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateRoleDTO } from './dto/role.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
  ) {}

  getQueryBuilder() {
    return this.accessRepository
      .createQueryBuilder('access')
      .leftJoinAndSelect('access.cooperative', 'cooperative');
  }

  async create(accessData: CreateAccessDto): Promise<Access> {
    const newAccess = this.accessRepository.create(accessData);
    await this.accessRepository.save(newAccess);

    return newAccess;
  }

  async findByCooperative(cooperativeId: string) {
    return this.getQueryBuilder()
      .where('cooperative.id = :cooperativeId', {
        cooperativeId,
      })
      .getOne();
  }

  async updateRole(body: UpdateRoleDTO, user: User) {
    const role = `${body.role}Role`;
    const newAdminRole = await this.getQueryBuilder()
      .where('cooperativeId.id = :cooperativeId', {
        cooperativeId: user.cooperative.id,
      })
      .getOne();
    const result = await this.accessRepository.save({
      ...newAdminRole,
      [role]: body.data.value,
    });

    return result;
  }
}
