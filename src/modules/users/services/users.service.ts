import { EncryptionService } from '@auth/services/encryption.service';
import { User } from '@modules/common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from '@users/dtos/create.dto';
import {
    PasswordInvalidException,
    UserAlreadyExistsException,
    UsernameInvalidException,
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

    /**
     * Retrieves all users from the repository.
     *
     * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
     * @throws {UsersNotFoundException} Throws an exception if no users are found.
     */
    async findAll(): Promise<User[]> {
        try {
            const users = await this.usersRepository.find();

            return users;
        } catch (error) {
            throw new UsersNotFoundException();
        }
    }

    /**
     * Retrieves a user by their unique identifier (UUID).
     *
     * @param uuid - The unique identifier of the user to be retrieved.
     * @returns A promise that resolves to the User object if found.
     * @throws UserNotFoundException if no user is found with the provided UUID.
     * @throws Error if there is an issue during the retrieval process.
     */
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

    /**
     * Finds a user by their username.
     *
     * @param username - The username of the user to find.
     * @returns A promise that resolves to the User object if found.
     * @throws UserNotFoundException if no user is found with the given username.
     */
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

    /**
     * Creates a new user in the system.
     *
     * @param userCreateDTO - The data transfer object containing user details for creation.
     * @throws UserAlreadyExistsException - If a user with the provided username already exists.
     * @throws UsernameInvalidException - If the provided username does not meet the required format.
     * @throws PasswordInvalidException - If the provided password does not meet the required strength criteria.
     * @returns A promise that resolves to void upon successful user creation.
     */
    async create(userCreateDTO: UserCreateDTO): Promise<void> {
        try {
            try {
                const existingUser = await this.findOneWithUsername(
                    userCreateDTO.username,
                );
                if (existingUser) {
                    throw new UserAlreadyExistsException(
                        userCreateDTO.username,
                    );
                }
            } catch (error) {}

            if (
                userCreateDTO.username.match(
                    /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim,
                ) === null
            ) {
                throw new UsernameInvalidException();
            }

            if (
                userCreateDTO.password.match(
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                ) === null
            ) {
                throw new PasswordInvalidException();
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

    /**
     * Deletes a user by their unique identifier (UUID).
     *
     * @param uuid - The unique identifier of the user to be deleted.
     * @throws UserNotFoundException - If no user is found with the provided UUID.
     * @returns A promise that resolves to void.
     */
    async delete(uuid: string): Promise<void> {
        try {
            const user = await this.findOne(uuid);

            if (!user) {
                throw new UserNotFoundException(uuid);
            }

            await this.usersRepository.remove(user);
            return;
        } catch (error) {
            throw error;
        }
    }
}
