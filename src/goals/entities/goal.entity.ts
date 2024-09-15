import { Priority, Status } from '../enums';

export class Goal {
  id: number;
  name: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
