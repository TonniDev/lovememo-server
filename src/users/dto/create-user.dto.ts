export class CreateUserDto {
  public name: string;
  public username?: string;
  public email: string;
  public password?: string;
  public oAuthId?: string;
  public oauth_id?: string;
  public oauth_providers?: string[];
  public oauth_info?: Record<string, any>;
}
