export interface User {
  readonly id: string;
  username: string;
  age: string;
  hobbies: string[];
}

export interface CreateUserDto {
  username: string;
  age: string;
  hobbies: string[];
}

export interface UpdateUserDto {
  username?: string;
  age?: string;
  hobbies?: string[];
}
