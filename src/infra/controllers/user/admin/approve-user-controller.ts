import { Request, Response } from "express";
import ApproveUserUseCase from "@/app/usecases/user/admin/approve-user-usecase";

export default class ApproveUserController {
  constructor(private readonly approveUserUseCase: ApproveUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { externalId } = req.params;

      if (!externalId) {
        return res.status(400).json({
          error: "External ID is required",
        });
      }

      const user = await this.approveUserUseCase.execute(externalId);

      return res.status(200).json({
        message: "User approved successfully",
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
