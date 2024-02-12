export interface User {
    readonly id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export interface CreateUserDto {
    username: string;
    age: number;
    hobbies: string[];
}

export interface UpdateUserDto {
    username?: string;
    age?: number;
    hobbies?: string[];
}
