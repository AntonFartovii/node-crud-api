import { UpdateUserDto } from '../models/user.entity';
import process from 'node:process';

export class DbService<T extends { id: string }> {
  list: T[];

  constructor() {
    this.list = [];
    process.on('message', (data: T[]) => {
      this.list = data;
    });
  }

  sendList() {
    process.send && process.send(this.list);
  }

  async create(entity: T) {
    this.list.push(entity);
    this.sendList();
    return entity;
  }

  async findAll() {
    this.sendList();
    return this.list;
  }

  async findOne(id: string) {
    const entity = this.list.find((entity) => entity.id === id);
    this.sendList();
    return entity || null;
  }

  async delete(id: string) {
    const newList = this.list.filter((entity) => entity.id !== id);
    this.list = newList;
    this.sendList();
    return `Entity id = ${id} is deleted`;
  }

  async updateOne(id: string, dto: UpdateUserDto) {
    const entity = await this.findOne(id);
    const newList = this.list.filter((entity) => entity.id !== id);
    const updatedEntity: T = Object.assign({}, entity, dto);
    this.list = [...newList, updatedEntity];
    this.sendList();
    return updatedEntity;
  }
}
