export interface INotificationService {
  send({
    subject,
    content,
    to
  }: {
    subject: string;
    content: string;
    to: string[] | string;
  }): Promise<void>;
}
