import { Request, Response } from "express";
import ReproveUserUseCase from "@/app/usecases/user/admin/reprove-user-usecase";

export default class ReproveUserController {
  constructor(private readonly reproveUserUseCase: ReproveUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { externalId } = req.params;
      const { reason } = req.body;

      if (!externalId) {
        return res.status(400).json({
          error: "External ID is required",
        });
      }

      const user = await this.reproveUserUseCase.execute(externalId, reason);

      return res.status(200).json({
        message: "User reproved successfully",
        user: {
          externalId: user.externalId,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
