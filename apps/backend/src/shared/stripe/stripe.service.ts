import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService extends Stripe {
	constructor(readonly configService: ConfigService) {
		super(configService.getOrThrow<string>('STRIPE_API_KEY'), { apiVersion: '2022-11-15' });
	}
}
