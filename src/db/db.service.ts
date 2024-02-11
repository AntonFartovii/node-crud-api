import { UpdateUserDto } from '../models/user.entity';

export class DbService<T extends { id: string }> {
  list: T[];

  constructor() {
    this.list = [];
  }

  async create(entity: T) {
    this.list.push(entity);
    return entity;
  }

  async findAll() {
    return this.list;
  }

  async findOne(id: string) {
    const entity = this.list.find((entity) => entity.id === id);
    return entity || null;
  }

  async deleteOne(id: string) {
    const newList = this.list.filter((entity) => entity.id !== id);
    this.list = newList;
    return 'ok';
  }

  async updateOne(id: string, dto: UpdateUserDto) {
    const entity = await this.findOne(id);
    const newList = this.list.filter((entity) => entity.id !== id);
    const updatedEntity: T = Object.assign({}, entity, dto);
    this.list = [...newList, updatedEntity];
    return updatedEntity;
  }
}
