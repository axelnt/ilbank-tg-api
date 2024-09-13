import { EncryptionService } from '@auth/services/encryption.service';
import { User } from '@modules/common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from '@users/dtos/create.dto';
import {
    UserAlreadyExistsException,
    UserNotFoundException,
    UsersNotFoundException,
} from '@users/users.exceptions';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly encryptionService: EncryptionService,
    ) {}

    async findAll(): Promise<User[]> {
        try {
            const users = await this.usersRepository.find();

            return users;
        } catch (error) {
            throw new UsersNotFoundException();
        }
    }

    async findOne(uuid: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { uuid },
            });

            if (!user) {
                throw new UserNotFoundException(uuid);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async findOneWithUsername(username: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username },
            });

            if (!user) {
                throw new UserNotFoundException(username);
            }

            return user;
        } catch (error) {
            throw new UserNotFoundException(username);
        }
    }

    async create(userCreateDTO: UserCreateDTO): Promise<void> {
        try {
            if (await this.findOneWithUsername(userCreateDTO.username)) {
                throw new UserAlreadyExistsException(userCreateDTO.username);
            }

            const hashedPassword = await this.encryptionService.hash(
                userCreateDTO.password,
            );
            userCreateDTO.password = hashedPassword;

            const user = this.usersRepository.create(userCreateDTO);

            await this.usersRepository.save(user);

            return;
        } catch (error) {
            throw error;
        }
    }

    async delete(uuid: string): Promise<void> {
        try {
            const user = await this.findOne(uuid);

            if (!user) {
                throw new Error('User not found');
            }

            await this.usersRepository.remove(user);
            return;
        } catch (error) {
            throw error;
        }
    }
}
