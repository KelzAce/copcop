import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Role } from './entities/roles.enum';
import { User } from './entities/user.entity';
import { slugify } from 'src/utils/helper';

import { Cooperative } from 'src/cooperative/entities/cooperative.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(data: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(data);
  }

  // async create(
  //   data: Partial<CreateUserDto>,
  //   transactionManager:  EntityManager,
  // ): Promise<User> {
  //   const userRepo = transactionManager.getRepository(User);
  //   const cooperativeRepo = transactionManager.getRepository(Cooperative);
  //   // const accessRepo = transactionManager.getRepository(Access);

  //   const { first_name,  ...rest } = data;

    // const cooperative = cooperativeRepo.create({
    //   cooperative_name, 
    //   slug: slugify(cooperative_name)
    // });

    // await cooperativeRepo.save(cooperative);

    // const user = userRepo.create({
    //   ...rest,
    //   // cooperative,
    //   role: Role.MEMBER,
    // });

    // await accessRepo.save({
    //   // cooperative: user.cooperative,
    //   isPrincipal: true,
    //   isExcoRole: defaultPrincipalAccess,
    //   othersRole: defaultAccess,
    // });

    // await userRepo.save(user);

    // return user;
  // }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, deleted_at: null },
      relations: ['cooperative'],
    });
    return user;
  }

  findByCooperative(id: string) {
    const result = this.userRepository
      .createQueryBuilder('user')
      .select(['user.role', 'COUNT(user.id) as count'])
      .where('user.cooperativeId = :cooperativeId', { cooperativeId: id })
      .groupBy('user.role')
      .getRawMany();

    return result;
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cooperative', 'cooperative')
      .where('user.id = :id', { id })
      .getOne();
  }

  update(query: FindOptionsWhere<User>, data: Partial<User>) {
    return this.userRepository.update(query, data);
  }
}
