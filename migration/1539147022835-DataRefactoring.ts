import { MigrationInterface, QueryRunner } from "typeorm";

export class DataRefactoring1539147022835 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO category (id, name, description, parentCid, status, sort)
      VALUES (1, '社区', '这是一个社区', NULL, 1, 1);
    `)

    await queryRunner.query(`
      INSERT INTO tag (id, name, description, status, sort, pid, level)
      VALUES
        (1, 'hot', '这是 hot', 1, 10, 0, 1),
        (2, '个股', '这是个股', 1, 20, 0, 1),
        (3, '实战', '这是实战', 1, 30, 0, 1),
        (4, '话题', '这是话题', 1, 40, 0, 1),
        (5, '评论', '这是评论', 1, 50, 0, 1);
    `);
    
    await queryRunner.query(`
    INSERT INTO user (id, password, phone, email, picture, status, createAt, updateAt, nickname, aboutme, sex, isAdmin)
    VALUES
      (1, 'b946ccc987465afcda7e45b1715219711a13518d1f1663b8c53b848cb0143441', '13333333333', NULL, 'http://dev-ggt-public.oss-cn-shenzhen.aliyuncs.com/userheader31537876068', 1, '2018-10-15 10:20:22', '2018-10-15 10:20:22', '13316460001', NULL, NULL, 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DELETE FROM category where id in(1);
    `);

    await queryRunner.query(`
      DELETE FROM tag where id in(1, 2, 3, 4, 5);
    `);

    await queryRunner.query(`
      DELETE FROM user where id in(1);
    `);
  }

}
