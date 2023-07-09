import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import Stripe from 'stripe';
import { MailerService } from '../../../shared/mailer/mailer.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { StripeService } from '../../../shared/stripe/stripe.service';
import { formatCurrency } from '../../../utils';
import { ParamsWithOnlyID } from '../../../utils/commons.validator';
import { AuthPresenter } from '../../auth/auth.presenter';

@Injectable()
export class MyCompanyPlanService {
	private MIN_PRICE_TO_PAY_IN_BRL = 5;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService,
		private readonly mailerService: MailerService,
	) {}

	async verifyPlanCosts(auth: AuthPresenter, params: ParamsWithOnlyID) {
		const company = await this.prismaService.company.findFirst({
			where: { id: auth.user.company.id },
			include: { companyPlan: { include: { plan: true } } },
		});

		if (!company) {
			throw new NotFoundException('Empresa não encontrada.');
		}

		const plan = await this.prismaService.plan.findFirst({ where: { id: params.id, active: true, public: true } });

		if (!plan) {
			throw new NotFoundException('Plano não encontrado.');
		}

		if (!company.companyPlan) {
			return { remainingDays: 0, discount: 0 };
		}

		const today = dayjs().format('YYYY-MM-DD');
		const companyPlanExpiration = dayjs(company.companyPlan.expiresAt).format('YYYY-MM-DD');
		const diff = dayjs(companyPlanExpiration).diff(today, 'days');

		const discount = Math.max(0, Math.min(plan.price - this.MIN_PRICE_TO_PAY_IN_BRL, (company.companyPlan.plan.price / 30) * diff)) || 0;

		return { remainingDays: diff, discount };
	}

	async changePlan(auth: AuthPresenter, params: ParamsWithOnlyID, origin: string) {
		const company = await this.prismaService.company.findFirst({
			where: { id: auth.user.company.id },
			include: { companyPlan: { include: { plan: true } } },
		});

		if (!company) {
			throw new NotFoundException('Empresa não encontrada.');
		}

		const plan = await this.prismaService.plan.findFirst({ where: { id: params.id, active: true, public: true } });

		if (!plan) {
			throw new NotFoundException('Plano não encontrado.');
		}

		if (company.companyPlan) {
			const today = dayjs().format('YYYY-MM-DD');
			const companyPlanExpiration = dayjs(company.companyPlan.expiresAt).format('YYYY-MM-DD');
			const diff = dayjs(companyPlanExpiration).diff(today, 'days');

			const discount = Math.max(0, Math.min(plan.price - this.MIN_PRICE_TO_PAY_IN_BRL, (company.companyPlan.plan.price / 30) * diff)) || 0;

			if (plan.price <= discount) {
				return this.updateCompanyPlan({
					companyId: company.id,
					planId: plan.id,
					paid_value: 0,
					payer_id: auth.user.id,
				});
			}

			return this.createCheckout({
				planId: plan.id,
				companyId: company.id,
				price: plan.price - discount,
				payerId: auth.user.id,
				origin,
			});
		}

		return this.createCheckout({
			planId: plan.id,
			companyId: company.id,
			price: plan.price,
			payerId: auth.user.id,
			origin,
		});
	}

	private async updateCompanyPlan(params: { companyId: number; planId: number; paid_value: number; payer_id: number }) {
		await this.prismaService.$transaction(async (trx) => {
			const companyPlan = await this.prismaService.companyPlan.findUnique({ where: { companyId: params.companyId } });

			if (companyPlan) {
				await this.prismaService.companyPlan.update({
					where: { companyId: params.companyId },
					data: {
						planId: params.planId,
						paidAt: dayjs().toISOString(),
						expiresAt: dayjs().add(30, 'days').toISOString(),
					},
				});
			} else {
				await this.prismaService.companyPlan.create({
					data: {
						planId: params.planId,
						paidAt: dayjs().toISOString(),
						expiresAt: dayjs().add(30, 'days').toISOString(),
						companyId: params.companyId,
					},
				});
			}

			try {
				const user = await this.prismaService.user.findUniqueOrThrow({ where: { id: params.payer_id } });
				const company = await this.prismaService.company.findUniqueOrThrow({ where: { id: params.companyId } });
				const plano = await this.prismaService.plan.findUniqueOrThrow({ where: { id: params.planId } });

				await this.mailerService.sendMail({
					subject: 'Confirmação de pagamento',
					to: user.email,
					payload: {
						template: 'confirm-plan-purcharse',
						props: {
							name: user.name,
							company: company.name,
							nome_do_plano: plano.name,
							valor_pago: formatCurrency(params.paid_value),
						},
					},
				});
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('Erro ao enviar e-mail de confirmação.');
			}
		});

		return { activated: true };
	}

	private async createCheckout(params: { planId: number; companyId: number; price: number; payerId: number; origin: string }) {
		const { planId, companyId, price, payerId, origin } = params;

		const company = await this.prismaService.company.findUnique({ where: { id: companyId } });

		if (!company) {
			throw new NotFoundException('Empresa não encontrada.');
		}

		const plan = await this.prismaService.plan.findUnique({ where: { id: planId } });

		if (!plan) {
			throw new NotFoundException('Plano não encontrado.');
		}

		try {
			const session = await this.stripeService.checkout.sessions.create({
				success_url: `${origin}/perfil/plano-da-empresa?validated-payment=true`,
				cancel_url: `${origin}/perfil/plano-da-empresa`,
				locale: 'pt-BR',
				metadata: { planId, companyId, payerId },
				mode: 'payment',
				allow_promotion_codes: true,
				consent_collection: {
					terms_of_service: 'required',
				},
				line_items: [
					{
						quantity: 1,
						price_data: {
							currency: 'brl',
							unit_amount: Math.round(price * 100),
							product_data: {
								name: plan.name,
								description: `Plano '${plan.name}' para a empresa '${company.name}'.`,
							},
						},
					},
				],
			});

			return {
				checkout_url: session.url,
			};
		} catch (e) {
			console.log(e.message);
			throw new InternalServerErrorException('Falha ao criar link de pagamento.');
		}
	}

	async stripeCallback(event: Stripe.Event) {
		if (!['checkout.session.async_payment_succeeded', 'checkout.session.completed'].includes(event.type)) {
			throw new BadRequestException('Tipo de evento inválido.');
		}

		const session = event.data.object as Stripe.Checkout.Session;

		if (session.payment_status !== 'paid') {
			return { activated: false, reason: 'Pagamento não foi confirmado.' };
		}

		const { planId, companyId, payerId } = session.metadata;

		return this.updateCompanyPlan({
			companyId: Number(companyId),
			planId: Number(planId),
			payer_id: Number(payerId),
			paid_value: session.amount_total / 100,
		});
	}
}
