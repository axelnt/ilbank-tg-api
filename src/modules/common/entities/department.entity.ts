import {
    BeforeInsert,
    Column,
    Entity,
    ManyToMany,
    PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { v4 as uuid } from 'uuid';
import { Program } from './program.entity';

@Entity()
export class Department {
    /**
     * Unique identifier for the department.
     */
    @PrimaryColumn()
    id: string;

    /**
     * Public identifier for the department.
     */
    @Column({ unique: true })
    uuid: string;

    /**
     * Name of the department.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Programs of the department.
     */
    @ManyToMany(() => Program)
    programs: Program[];

    /**
     * If the department is soft deleted.
     */
    @Column({ default: false, select: false })
    deleted: boolean;

    @BeforeInsert()
    generateId() {
        this.id = ulid();
        this.uuid = uuid();
    }
}
