import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { v4 as uuid } from 'uuid';

@Entity()
export class User {
    /**
     * Unique identifier for the user. Uses ULID(Universally Unique Lexicographically Sortable Identifier).
     */
    @Exclude()
    @PrimaryColumn()
    id: string;

    /**
     * The user's public identifier.
     */
    @Column({ unique: true })
    uuid: string;

    /**
     * The user's username.
     */
    @Column({ unique: true })
    username: string;

    /**
     * The user's password.
     */
    @Column({ unique: true, select: false })
    password: string;

    /**
     * If the user is soft deleted.
     */
    @Column({ default: false })
    deleted: boolean;

    @BeforeInsert()
    generateIds() {
        this.id = ulid();
        this.uuid = uuid();
    }
}
