import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1726438392933 implements MigrationInterface {
  name = 'SchemaUpdate1726438392933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "password_confirmation" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."goals_priority_enum" AS ENUM('Low', 'Medium', 'High')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."goals_status_enum" AS ENUM('Pending', 'In Progress', 'Completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "priority" "public"."goals_priority_enum" NOT NULL DEFAULT 'Low', "status" "public"."goals_status_enum" NOT NULL DEFAULT 'Pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "goals"`);
    await queryRunner.query(`DROP TYPE "public"."goals_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."goals_priority_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
