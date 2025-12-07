import { Request, Response } from "express";
import GetChallengeByIdUseCase from "@/app/usecases/challenge/get-challenge-by-id-usecase";

export default class GetChallengeByIdController {
  constructor(private readonly getChallengeByIdUseCase: GetChallengeByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Challenge ID is required",
        });
      }

      const challenge = await this.getChallengeByIdUseCase.execute(Number(id));

      if (!challenge) {
        return res.status(404).json({
          error: "Challenge not found",
        });
      }

      return res.status(200).json(challenge);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
