import { Request, Response } from "express";
import CreateChallengeUseCase from "@/app/usecases/challenge/create-challenge-usecase";

export default class CreateChallengeController {
  constructor(private readonly createChallengeUseCase: CreateChallengeUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, date, description, categoryId } = req.body;

      if (!name || !date || !categoryId) {
        return res.status(400).json({
          error: "Name, date, and categoryId are required",
        });
      }

      const challenge = await this.createChallengeUseCase.execute(
        name,
        new Date(date),
        description || null,
        categoryId
      );

      return res.status(201).json(challenge);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
