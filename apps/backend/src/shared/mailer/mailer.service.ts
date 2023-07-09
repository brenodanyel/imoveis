import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import edge from 'edge.js';
import mjml from 'mjml';
import path from 'node:path';
import nodemailer from 'nodemailer';

type SendMailTemplatePayload = {
	template: string;
	props?: Record<string, any>;
};

type SendMailParmas = {
	to: string;
	subject: string;
	payload: string | SendMailTemplatePayload;
};

@Injectable()
export class MailerService {
	private transporter: nodemailer.Transporter;

	constructor(private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			host: configService.getOrThrow<string>('MAILER_HOST'),
			port: configService.getOrThrow<number>('MAILER_PORT'),
			secure: false,
			auth: {
				user: configService.getOrThrow<string>('MAILER_USER'),
				pass: configService.getOrThrow<string>('MAILER_PASS'),
			},
		});
	}

	async sendMail(params: SendMailParmas) {
		const options = {
			from: this.configService.getOrThrow<string>('MAILER_FROM'),
			to: params.to,
			subject: params.subject,
		} as any;

		if (typeof params.payload === 'string') {
			options.text = params.payload;
		} else {
			options.html = await this.renderTemplate(params.payload);
		}

		const mail = await this.transporter.sendMail(options);

		if (this.configService.getOrThrow<string>('MAILER_HOST') === 'smtp.ethereal.email') {
			console.log('Ethereal mail sent!', {
				target: params.to,
				subject: params.subject,
				preview_url: nodemailer.getTestMessageUrl(mail),
			});
		}
	}

	private async renderTemplate(params: SendMailTemplatePayload) {
		const filepath = path.resolve('public', 'mail-templates', `${params.template}.mjml`);

		let content = await edge.render(filepath, params.props);

		// altera o caminho dos componentes para o caminho absoluto
		content = content.replace(/path="(.+?)"/g, (_, str) => {
			const absolute_path = str.replace(/^\./, path.resolve('public', 'mail-templates'));
			return `path="${absolute_path}"`;
		});

		const { html } = mjml(content);

		return html;
	}
}
