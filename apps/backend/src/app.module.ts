import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AnunciosModule } from './modules/anuncios/anuncios.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaracteristicasModule } from './modules/caracteristicas/caracteristicas.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ComodidadesModule } from './modules/comodidades/comodidades.module';
import { CompanyModule } from './modules/company/company.module';
import { MeModule } from './modules/me/me.module';
import { MyCompanyModule } from './modules/my-company/my-company.module';
import { PlanModule } from './modules/plan/plan.module';
import { RolesModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { ACLModule } from './shared/acl.module';
import { ConfigModule } from './shared/config.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { StorageModule } from './shared/storage/storage.module';
import { StripeModule } from './shared/stripe/stripe.module';
import { ThrottlerModule } from './shared/throttler.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ThrottlerModule,
		ConfigModule,
		StorageModule,
		StripeModule,
		MailerModule,
		PrismaModule,
		ACLModule,
		UserModule,
		CompanyModule,
		PlanModule,
		AnunciosModule,
		AuthModule,
		CaracteristicasModule,
		CategoriasModule,
		ComodidadesModule,
		MeModule,
		MyCompanyModule,
		RolesModule,
	],
	controllers: [AppController],
})
export class AppModule {}
