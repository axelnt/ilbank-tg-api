import { Exclude } from 'class-transformer';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Department } from './department.entity';
import { Directorate } from './directorate.entity';

@Entity()
export class Program {
    /**
     * Unique identifier for the program.
     */
    @Exclude()
    @PrimaryColumn()
    id: string;

    /**
     * Attached code of the program.
     */
    @Column({ unique: true })
    code: string;

    /**
     * Name of the program.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Users of the program.
     */
    @Column('simple-array', { nullable: true })
    users: string[];

    /**
     * Departments of the program.
     */
    @ManyToMany(() => Department, {
        nullable: true,
    })
    @JoinTable()
    departments: Department[];

    /**
     * Directorates of the program.
     */
    @ManyToMany(() => Directorate, {
        nullable: true,
    })
    @JoinTable()
    directorates: Directorate[];

    @Column({ default: false }) // false -> Birim Bazlı, true -> Süreç Bazlı
    processBased: boolean;

    /**
     * If the program is soft deleted.
     */
    @Column({ default: false, select: false })
    deleted: boolean;

    @BeforeInsert()
    generateId() {
        this.id = ulid();
    }
}
