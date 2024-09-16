import { Priority, Status } from '../enums';

export class CreateGoalDto {
  public name: string;
  public priority: Priority;
  public status: Status;
  public createdAt: string;
  public updatedAt: string;
}
