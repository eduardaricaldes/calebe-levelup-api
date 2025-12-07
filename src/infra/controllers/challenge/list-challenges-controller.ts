import { Request, Response } from "express";
import ListChallengesUseCase from "@/app/usecases/challenge/list-challenges-usecase";

export default class ListChallengesController {
  constructor(private readonly listChallengesUseCase: ListChallengesUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const challenges = await this.listChallengesUseCase.execute();

      return res.status(200).json(challenges);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
