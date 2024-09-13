import {
    BeforeInsert,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { v4 as uuid } from 'uuid';
import { Program } from './program.entity';

@Entity()
export class Directorate {
    /**
     * Unique identifier for the directorate.
     */
    @PrimaryColumn()
    id: string;

    /**
     * Public identifier for the directorate.
     */
    @Column({ unique: true })
    uuid: string;

    /**
     * Name of the directorate.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Parent directorate of the directorate.
     */
    @ManyToOne(() => Directorate, (directorate) => directorate.children, {
        nullable: true,
    })
    parent: Directorate;

    @OneToMany(() => Directorate, (directorate) => directorate.parent, {
        nullable: true,
    })
    children: Directorate[];

    @ManyToMany(() => Program, {
        nullable: true,
    })
    programs: Program[];

    /**
     * If the directorate is soft deleted.
     */
    @Column({ default: false, select: false })
    deleted: boolean;

    @BeforeInsert()
    generateId() {
        this.id = ulid();
        this.uuid = uuid();
    }
}
