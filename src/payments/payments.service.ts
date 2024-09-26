import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Payment } from "./entities/payment.entity";

@Injectable()
export class PaymentsService {
  // processPayment(paymentDto: CreatePaymentDto): Promise<Payment> {
  //   // Handle card, bank transfer, and wallet payments
  //   const payment = this.paymentRepository.create(paymentDto);
  //   return this.paymentRepository.save(payment);
  // }
}
