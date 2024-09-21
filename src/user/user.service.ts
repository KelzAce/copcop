import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';

import { Role } from './entities/roles.enum';
import { User } from './entities/user.entity';
import { Cooperative } from 'src/shared/entities/cooperative.entity';
import { Access } from 'src/access/entities/access.entity';
import { slugify } from 'src/utils/helper';
import { defaultAccess, defaultPrincipalAccess } from './dto/access.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(data: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(data);
  }

  async create(
    data: Partial<CreateUserDto>,
    transactionManager:  EntityManager,
  ): Promise<User> {
    // const countryRepo = transactionManager.getRepository(CountryCode);
    const userRepo = transactionManager.getRepository(User);
    // const walletRepo = transactionManager.getRepository(Wallet);
    const cooperativeRepo = transactionManager.getRepository(Cooperative);
    const accessRepo = transactionManager.getRepository(Access);

    const { cooperative_name, country_code, ...rest } = data;
    // const countryData = byIso(data.country_code.toUpperCase());

    // let countryCode = await countryRepo.findOneBy({
    //   country_name: countryData.country,
    // });

    // if (!countryCode) {
    //   countryCode = countryRepo.create({
    //     code: country_code,
    //     continent_name: countryData.continent,
    //     country_name: countryData.country,
    //   });
    //   await countryRepo.save(countryCode);
    // }

    const cooperative = cooperativeRepo.create({
      // cooperative_name,
      // slug: slugify(cooperative_name),
      // countryCode,
    });

    await cooperativeRepo.save(cooperative);

    // const currency = countryData.country === 'Nigeria' ? 'NGN' : 'USD';

    const user = userRepo.create({
      ...rest,
      cooperative,
      role: Role.PRINCIPAL,
    });

    await accessRepo.save({
      cooperative: user.cooperative,
      isOwner: true,
      principalRole: defaultPrincipalAccess,
      adminstratorRole: defaultAccess,
      supervisorRole: defaultAccess,
      othersRole: defaultAccess,
    });

    await userRepo.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
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
