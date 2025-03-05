import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class AddFarmedPointsDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('userId') })
  @IsString({ message: requestMessages.isString('userId') })
  userId: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('tapsCount') })
  @IsNumber({}, { message: requestMessages.isNumber('tapsCount') })
  @Min(1, { message: requestMessages.isPositive('tapsCount') })
  tapsCount: number;
}
