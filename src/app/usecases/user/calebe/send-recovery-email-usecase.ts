import UserRepository from "@/domain/repositories/user-repository";
import EmailSender from "@/domain/services/email-sender";
import { SendRecoveryEmailRequestDTO } from "@/app/dto/send-recovery-email-requestDTO";
import { UserStatus } from "@/domain/entities/user";
import crypto from 'crypto';

export default class SendRecoveryEmailUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailSender: EmailSender,
  ) {}
  
  async execute(sendRecoveryEmailRequestDTO: SendRecoveryEmailRequestDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(sendRecoveryEmailRequestDTO.email);

    if (!user) {
      return;
    }

    const recoveryToken = crypto.randomBytes(32).toString('hex');
    
    user.status = UserStatus.RESET_PASSWORD;
    user.updatedAt = new Date();
    await this.userRepository.update(user);

    const recoveryLink = `${process.env.FRONTEND_URL}/reset-password?token=${recoveryToken}&externalId=${user.externalId}`;
    
    await this.emailSender.sendEmail({
      to: user.email,
      subject: 'Recuperação de Senha',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Olá ${user.name},</p>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${recoveryLink}">Resetar Senha</a>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `,
      text: `Olá ${user.name}, você solicitou a recuperação de senha. Acesse o link para criar uma nova senha: ${recoveryLink}`,
    });
  }
}
