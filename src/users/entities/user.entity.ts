import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar')
  public name: string;

  @Column({ unique: true, type: 'varchar' })
  public username: string;

  @Column({ unique: true, type: 'varchar' })
  public email: string;

  @Column('varchar')
  public password: string;
}
