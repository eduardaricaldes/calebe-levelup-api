export interface SendEmailDTO {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export default interface EmailSender {
  sendEmail(data: SendEmailDTO): Promise<void>;
}
