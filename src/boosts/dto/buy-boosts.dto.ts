import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class BuyBoostsDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('userId') })
  @IsString({ message: requestMessages.isString('userId') })
  userId: string;

  @IsNotEmpty({ message: requestMessages.isNotEmpty('count') })
  @IsNumber({}, { message: requestMessages.isNumber('count') })
  @Min(1, { message: requestMessages.isPositive('count') })
  count: number;
}
