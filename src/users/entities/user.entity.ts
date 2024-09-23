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

  @Column({ type: 'varchar', nullable: true })
  public password: string;

  @Column({ type: 'varchar', nullable: true })
  public oauth_id: string;

  @Column({ type: 'simple-array', nullable: true })
  public oauth_providers: string[];

  @Column({ type: 'simple-json', nullable: true })
  public oauth_info: { [key: string]: any };
}
