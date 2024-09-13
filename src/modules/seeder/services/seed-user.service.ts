import { EncryptionService } from '@auth/services/encryption.service';
import { User } from '@modules/common/entities/user.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedUserService {
    private readonly logger = new Logger(SeedUserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configurationService: ConfigurationService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async seed() {
        const userCount = await this.userRepository.count();
        if (userCount === 0) {
            const hashedPassword = await this.encryptionService.hash(
                this.configurationService.initialAdminInformation.password,
            );
            const user = this.userRepository.create({
                username:
                    this.configurationService.initialAdminInformation.username,
                password: hashedPassword,
            });

            await this.userRepository.save(user);
            this.logger.log('Seeding complete!');
        } else {
            this.logger.log('Cancelled seeding, table contains data.');
        }
    }
}
