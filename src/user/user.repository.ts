import {dataSource} from "src/database/data-source"
import { User } from './entities/user.entity';

export const UserRepository = dataSource.getRepository(User);
