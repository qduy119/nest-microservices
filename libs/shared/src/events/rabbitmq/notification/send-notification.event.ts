export interface SendNotificationEvent {
  subject: string;
  content: string;
  to: string | string[];
}
