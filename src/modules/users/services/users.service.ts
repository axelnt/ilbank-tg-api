import { User } from '@modules/common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from '@users/dtos/create.dto';
import { ResponseUsersDTO } from '@users/dtos/response-users.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        try {
            return this.usersRepository.find();
        } catch (error) {
            throw error;
        }
    }

    async findOne(uuid: string): Promise<User> {
        try {
            return this.usersRepository.findOne({ where: { uuid } });
        } catch (error) {
            throw error;
        }
    }

    async findOneWithUsername(username: string): Promise<User> {
        try {
            return this.usersRepository.findOne({
                where: { username },
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserPassword(username: string): Promise<User> {
        try {
            return this.usersRepository.findOne({
                where: { username },
                select: ['password'],
            });
        } catch (error) {
            throw error;
        }
    }

    async create(userCreateDTO: UserCreateDTO): Promise<User> {
        try {
            if (await this.findOneWithUsername(userCreateDTO.username)) {
                throw new Error('Username already exists');
            }

            return this.usersRepository.create(userCreateDTO);
        } catch (error) {
            throw error;
        }
    }

    async delete(userDeleteDTO: UserDeleteDTO): Promise<User> {
        try {
            const user = await this.findOne(userDeleteDTO.uuid);

            if (!user) {
                throw new Error('User not found');
            }

            return this.usersRepository.remove(user);
        } catch (error) {
            throw error;
        }
    }
}
