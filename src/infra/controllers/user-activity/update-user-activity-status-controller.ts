import { Request, Response } from "express";
import UpdateUserActivityStatusUseCase from "@/app/usecases/user-activity/update-user-activity-status-usecase";
import { UserActivityStatus } from "@/domain/entities/user-activity";

export default class UpdateUserActivityStatusController {
  constructor(private readonly updateUserActivityStatusUseCase: UpdateUserActivityStatusUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status, approverId, repprovedDescription } = req.body;

      if (!id) {
        return res.status(400).json({
          error: "User activity ID is required",
        });
      }

      if (!status || !approverId) {
        return res.status(400).json({
          error: "status and approverId are required",
        });
      }

      // Validar que o status é válido
      if (!Object.values(UserActivityStatus).includes(status)) {
        return res.status(400).json({
          error: "Invalid status. Must be APPROVED or REJECTED",
        });
      }

      const userActivity = await this.updateUserActivityStatusUseCase.execute(
        Number(id),
        status as UserActivityStatus,
        approverId,
        repprovedDescription
      );

      return res.status(200).json(userActivity);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
