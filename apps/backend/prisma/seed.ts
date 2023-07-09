import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { readdir } from 'fs/promises';

const prisma = new PrismaClient();

export const main = async () => {
	const path = `${__dirname}/seeds/`;

	console.log('🌱 Seeding database...\n');

	for (let file of await readdir(path)) {
		const res = await import(`${path}/${file}`);

		const before = performance.now();

		console.log('\t🌱', file, 'started seeding...');

		await res.default(prisma);

		console.log('\t🌱', file, `seeded successfully! (${(performance.now() - before).toFixed(0)}ms}\n`);
	}

	console.log('🌱 Seeding complete!');
};

main()
	.catch((e) => console.error(e))
	.finally(() => prisma.$disconnect());
