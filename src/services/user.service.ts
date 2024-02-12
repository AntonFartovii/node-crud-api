import { DbService } from '../db/db.service';
import { CreateUserDto, UpdateUserDto, User } from '../models/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../exeptions';

class UserService {
  dbService: DbService<User>;

  constructor() {
    this.dbService = new DbService<User>();
  }

  async create(dto: CreateUserDto) {
    const id = uuidv4();
    const user = { ...dto, id } as User;
    return await this.dbService.create(user);
  }

  async getAll() {
    return await this.dbService.findAll();
  }

  async getOne(id: string) {
    const user = await this.dbService.findOne(id);
    if (!user) {
      throw new HttpError(404, 'User not found!');
    }
    return user;
  }

  async put(id: string, dto: UpdateUserDto) {
    const user = await this.getOne(id);
    return await this.dbService.updateOne(id, dto);
  }

  async delete(id: string) {
    await this.getOne(id);
    return await this.dbService.delete(id);
  }
}

export default new UserService();
