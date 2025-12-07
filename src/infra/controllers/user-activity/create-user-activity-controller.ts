import { Request, Response } from "express";
import CreateUserActivityUseCase from "@/app/usecases/user-activity/create-user-activity-usecase";

export default class CreateUserActivityController {
  constructor(private readonly createUserActivityUseCase: CreateUserActivityUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, actionId, challengeId, photoUrl, date } = req.body;

      if (!userId || !date) {
        return res.status(400).json({
          error: "userId and date are required",
        });
      }

      if (!actionId && !challengeId) {
        return res.status(400).json({
          error: "Either actionId or challengeId must be provided",
        });
      }

      const userActivity = await this.createUserActivityUseCase.execute(
        userId,
        actionId,
        challengeId,
        photoUrl,
        new Date(date)
      );

      return res.status(201).json(userActivity);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
