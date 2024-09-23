import { AuthStrategy } from '../enums';

export class RegisterDto {
  email: string;
  name: string;
  password?: string;
  oauth_id?: string;
  oauth_providers?: string[];
  oauth_info?: Record<string, any>;
  provider?: AuthStrategy;
  providerId?: string;
  picture?: string;
}

export default RegisterDto;
