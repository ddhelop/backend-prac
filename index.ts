// const qqq: string = "안녕하세요";
// console.log(qqq);

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "34.63.244.122",
  port: 5003,
  username: "postgres",
  password: "postgres2022",
  database: "postgres",
  entities: [Board],
  synchronize: true,
  logging: true, // 명령어가 어떻게 바뀌는지 ㅗㅂ기
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB 접속 성공");
  })
  .catch((error) => {
    console.log("DB 접속 실패");
    console.log("원인 : ", error);
  });
