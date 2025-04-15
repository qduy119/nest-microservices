import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { IPaymentEntity } from '@app/shared';

@ApiExtraModels(IPaymentEntity)
@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
}
