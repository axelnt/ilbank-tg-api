import { EncryptionService } from '@auth/services/encryption.service';
import { User } from '@common/entities/user.entity';
import { ConfigurationModule } from '@configuration/configuration.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserDeleteDTO } from '@users/dtos/delete.dto';
import { UserGetByPublicIdDTO } from '@users/dtos/get-by-public-id.dto';
import { ResponseUserDTO } from '@users/dtos/response-user.dto';
import {
    PasswordInvalidException,
    UserAlreadyExistsException,
    UsernameInvalidException,
    UserNotFoundException,
} from '@users/users.exceptions';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../dtos/create.dto';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    let controller: UsersController;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    synchronize: true,
                    entities: [User],
                }),
                TypeOrmModule.forFeature([User]),
                ConfigurationModule,
                JwtModule,
            ],
            controllers: [UsersController],
            providers: [UsersService, EncryptionService],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const userCreateDTO: UserCreateDTO = {
                username: 'testUsername',
                password: 'thisIsAPassword123',
            };

            // Create a user with the userCreateDTO
            await controller.create(userCreateDTO);

            // Find the user in the database
            const user = await repository.findOne({
                where: { username: 'testUsername' },
                select: ['id', 'username', 'password'],
            });

            // Check if the user is created
            expect(user).toBeDefined();

            // Check if the username is correct
            expect(user.username).toBeDefined();
            expect(user.username).toBe('testUsername');

            // Check if the password is hashed
            expect(user.password).toBeDefined();
            expect(user.password).not.toBe('thisIsAPassword123');
            expect(user.password).not.toHaveLength(0);
        });

        it('should throw an error if the user already exists', async () => {
            const userCreateDTO: UserCreateDTO = {
                username: 'testUsername',
                password: 'thisIsAPassword123',
            };

            // Try to create the same user again
            try {
                await controller.create(userCreateDTO);
            } catch (error) {
                // Check if the error is thrown
                expect(error).toBeDefined();

                // Check if the error is an instance of UserAlreadyExistsException
                expect(error).toBeInstanceOf(UserAlreadyExistsException);
            }
        });

        it('should throw an error if the username is invalid', async () => {
            const userCreateDTO: UserCreateDTO = {
                username: 'test',
                password: 'thisIsAPassword123',
            };

            // Try to create a user with an invalid username
            try {
                await controller.create(userCreateDTO);
            } catch (error) {
                // Check if the error is thrown
                expect(error).toBeDefined();

                // Check if the error is an instance of UsernameInvalidException
                expect(error).toBeInstanceOf(UsernameInvalidException);
            }
        });

        it('should throw an error if the password is invalid', async () => {
            const userCreateDTO: UserCreateDTO = {
                username: 'testUsername',
                password: 'password',
            };

            // Try to create a user with an invalid password
            try {
                await controller.create(userCreateDTO);
            } catch (error) {
                // Check if the error is thrown
                expect(error).toBeDefined();

                // Check if the error is an instance of PasswordInvalidException
                expect(error).toBeInstanceOf(PasswordInvalidException);
            }
        });
    });

    describe('findOne', () => {
        it('should find a user', async () => {
            // Create a user
            const userCreateDTO: UserCreateDTO = {
                username: 'testUsername',
                password: 'thisIsAPassword123',
            };
            await controller.create(userCreateDTO);

            // Get the user from the database
            const user = await repository.findOne({
                where: { username: 'testUsername' },
                select: ['uuid'],
            });

            const userGetByPublicIdDTO: UserGetByPublicIdDTO = {
                uuid: user.uuid,
            };

            // Find the user with the userGetByIdDTO
            const foundUser = await controller.findOne(userGetByPublicIdDTO);

            // Check if the user is found
            expect(foundUser).toBeDefined();

            // Check if the user is an instance of ResponseUserDTO
            expect(foundUser).toBeInstanceOf(ResponseUserDTO);

            // Check if the user is correct
            expect(foundUser.uuid).toBeDefined();
            expect(foundUser.uuid).toBe(user.uuid);
        });

        it('should throw an error if the user is not found', async () => {
            const userGetByPublicIdDTO: UserGetByPublicIdDTO = {
                uuid: 'testUuid',
            };

            // Try to find a user that does not exist
            try {
                await controller.findOne(userGetByPublicIdDTO);
            } catch (error) {
                // Check if the error is thrown
                expect(error).toBeDefined();

                // Check if the error is an instance of UserNotFoundException
                expect(error).toBeInstanceOf(UserNotFoundException);
            }
        });
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            // Create 2 users
            const firstUserCreateDTO: UserCreateDTO = {
                username: 'firstUser',
                password: 'thisIsAPassword123',
            };
            await controller.create(firstUserCreateDTO);
            const secondUserCreateDTO: UserCreateDTO = {
                username: 'secondUser',
                password: 'thisIsAPassword123',
            };
            await controller.create(secondUserCreateDTO);

            // Find all users
            const users = await controller.findAll();

            // Check if the users are found
            expect(users).toBeDefined();

            // Check if the users are an array
            expect(users).toBeInstanceOf(Array);

            // Check if all users are found
            expect(users).toHaveLength(2);

            // Check if the users are instances of ResponseUserDTO
            users.forEach((user) => {
                expect(user).toBeInstanceOf(ResponseUserDTO);
            });
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            // Create a user
            const userCreateDTO: UserCreateDTO = {
                username: 'testUsername',
                password: 'thisIsAPassword123',
            };
            await controller.create(userCreateDTO);

            // Get the user from the database
            const user = await repository.findOne({
                where: { username: 'testUsername' },
                select: ['uuid'],
            });

            const userDeleteDTO: UserDeleteDTO = {
                uuid: user.uuid,
            };

            // Delete the user with the user.uuid
            await controller.delete(userDeleteDTO);

            const foundUser = await repository.findOne({
                where: { uuid: user.uuid },
                select: ['uuid'],
            });

            // Check if the user is deleted
            expect(foundUser).toBeNull();
        });

        it('should throw an error if the user is not found', async () => {
            const userDeleteDTO: UserDeleteDTO = {
                uuid: 'UUID',
            };

            // Try to delete a user that does not exist
            try {
                await controller.delete(userDeleteDTO);
            } catch (error) {
                // Check if the error is thrown
                expect(error).toBeDefined();

                // Check if the error is an instance of UserNotFoundException
                expect(error).toBeInstanceOf(UserNotFoundException);
            }
        });
    });
});
