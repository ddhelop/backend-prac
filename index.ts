// const qqq: string = "안녕하세요";
// console.log(qqq);

//
import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// API-DOCS 만들기
const typeDefs = `#graphql
  input CreateBoardInput{
    writer: String
    title: String
    contents: String
  }

  type MyBoard {
    number: Int
    writer: String
    title: String
    contents: String
  }

  type Query {
    fetchBoards: [MyBoard]
    
  }

  type Mutation{
    # 연습용 (example)
    # createBoard(writer: String, title: String, contents: String): String

    # 실무용 (practice)
    createBoard(createBoardInput: CreateBoardInput): String

  }
`;

// API 만들기
const resolvers = {
  Query: {
    fetchBoards: async () => {
      // 1. 모두 꺼내기
      const result = await Board.find();
      console.log(result);

      // 2. 한개만 꺼내기
      // const result = await Board.findOne({ where: { number: 3 } });
      // console.log(result);
      return result;
    },
  },

  Mutation: {
    createBoard: async (parent: any, args: any, context: any, info: any) => {
      await Board.insert({
        ...args.createBoardInput,

        // 하나 하나 모두 입력하는 비효율적인 방식
        // writer: args.createBoardInput.writer,
        // title: args.createBoardInput.title,
        // contents: args.createBoardInput.contents,
      });

      return "게시글 등록 성공";
    },

    updateBoard: async () => {
      // 3번 게시글을 영희로 바꿔줘
      await Board.update({ number: 3 }, { writer: "영희" });
    },

    deleteBoard: async () => {
      // 3번 게시글 삭제해줘
      await Board.delete({ number: 3 });

      // 3번 게시글 삭제했다 치자.(소프트 삭제)
      await Board.update({ number: 3 }, { isDeleted: true });

      // 소프트삭제, deletedAt이 초기값 NULL 이면?, new Date() 들어가 있으면? 삭제 된거
      Board.update({ number: 3 }, { deletedAt: new Date() });
    },
  },
};

// @ts-ignore
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true,
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "34.63.244.122",
  port: 5003,
  username: "postgres",
  password: "postgres2022",
  database: "postgres",
  entities: [Board],
  synchronize: true,
  logging: true, // 명령어가 어떻게 바뀌는지 보기
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB 접속 성공");

    startStandaloneServer(server).then(() => {
      console.log("graphql 서버가 실행되었습니다.");
    });
  })
  .catch((error) => {
    console.log("DB 접속 실패");
    console.log("원인 : ", error);
  });
