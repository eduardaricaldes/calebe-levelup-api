import { Request, Response } from "express";
import GetChallengesByUserUseCase from "@/app/usecases/challenge/get-challenges-by-user-usecase";

export default class GetChallengesByUserController {
  constructor(private readonly getChallengesByUserUseCase: GetChallengesByUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          error: "User ID is required",
        });
      }

      const challenges = await this.getChallengesByUserUseCase.execute(Number(userId));

      return res.status(200).json(challenges);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
