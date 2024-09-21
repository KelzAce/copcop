import dataSource from "../database/data-source"
import { User } from './entities/user.entity';

export const UserRepository = dataSource.getRepository(User);
