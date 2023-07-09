import { AuthPresenter } from '../modules/auth/auth.presenter';
import { ACLService } from '../shared/acl.module';
import { PrismaClient } from '@prisma/client';
import generator from 'generate-password';

const prisma = new PrismaClient();
const acl = new ACLService();

export async function isMainCompany(id: number) {
	const mainCompany = await prisma.company.findUniqueOrThrow({ where: { cnpj: '00000000000000' } });
	return mainCompany.id === id;
}

export async function verifyIfUserIsSettingRestrictRole(roles: number[], auth: AuthPresenter) {
	const foundRestrictRole = await prisma.role.findFirst({
		where: {
			AND: [{ slug: { in: ['admin_geral'] } }, { id: { in: roles } }],
		},
	});

	if (!foundRestrictRole) return;

	acl.verifyPermission(
		'add-restrict-role-to-user',
		auth,
		`Você não tem permissão para vincular o usuário à função restrita '${foundRestrictRole.name} (${foundRestrictRole.slug})'.`,
	);
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function generateRandomPassword() {
	return generator.generate({
		length: 10,
		numbers: true,
		symbols: true,
		excludeSimilarCharacters: true,
		strict: true,
		uppercase: true,
		lowercase: true,
		exclude: '(){}[]/\\^~\'"`<>|,;:*_',
	});
}
