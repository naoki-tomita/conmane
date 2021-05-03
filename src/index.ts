import "./gateway";

import { PrismaClient } from ".prisma/client";
import { register, get } from "automated-omusubi";
import { UserUseCase } from "./usecase/UserUseCase";
import { SessionUseCase } from "./usecase/SessionUseCase";
import { ModelUseCase } from "./usecase/ModelUseCase";
import { EntryUseCase } from "./usecase/EntryUseCase";

export class App {
  private container: {
    userUseCase: UserUseCase;
    sessionUseCase: SessionUseCase;
    modelUseCase: ModelUseCase;
    entryUseCase: EntryUseCase;
  };

  get<T extends keyof App["container"]>(useCaseName: T): App["container"][T] {
    return this.container[useCaseName];
  }

  constructor() {
    const client = new PrismaClient();
    register(client).as(PrismaClient);
    this.container = {
      userUseCase: get(UserUseCase),
      sessionUseCase: get(SessionUseCase),
      modelUseCase: get(ModelUseCase),
      entryUseCase: get(EntryUseCase),
    };
  }
}

export const app = new App();
