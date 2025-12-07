import { Request, Response } from "express";
import GetChallengesByCategoryUseCase from "@/app/usecases/challenge/get-challenges-by-category-usecase";

export default class GetChallengesByCategoryController {
  constructor(private readonly getChallengesByCategoryUseCase: GetChallengesByCategoryUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.query;

      if (!categoryId) {
        return res.status(400).json({
          error: "Category ID is required",
        });
      }

      const challenges = await this.getChallengesByCategoryUseCase.execute(Number(categoryId));

      return res.status(200).json(challenges);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
