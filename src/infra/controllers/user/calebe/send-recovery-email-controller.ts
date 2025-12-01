import SendRecoveryEmailUseCase from "@/app/usecases/user/calebe/send-recovery-email-usecase";
import { Request, Response } from "express";

export class SendRecoveryEmailController {
  constructor(private readonly sendRecoveryEmailUseCase: SendRecoveryEmailUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.body;

      if (!email) {
        return response.status(400).json({ message: 'Email is required' });
      }

      await this.sendRecoveryEmailUseCase.execute({ email });

      return response.status(200).json({ message: 'Recovery email sent successfully' });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}
