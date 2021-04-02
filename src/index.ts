import "./gateway";

import { PrismaClient } from ".prisma/client";
import { register, get } from "automated-omusubi";
import { UserUseCase } from "./usecase/UserUseCase";

export class App {
  container: {
    userUseCase: UserUseCase;
  };
  constructor() {
    const client = new PrismaClient();
    register(client).as(PrismaClient);
    this.container = {
      userUseCase: get(UserUseCase),
    };
  }
}

export const app = new App();
