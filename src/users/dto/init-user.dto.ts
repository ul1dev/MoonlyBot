import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class InitUserDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('telegramId') })
  @IsString({ message: requestMessages.isString('telegramId') })
  telegramId: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('firstName') })
  @IsString({ message: requestMessages.isString('firstName') })
  firstName: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('lastName') })
  @IsString({ message: requestMessages.isString('lastName') })
  lastName: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('username') })
  @IsString({ message: requestMessages.isString('username') })
  username: string;
}
