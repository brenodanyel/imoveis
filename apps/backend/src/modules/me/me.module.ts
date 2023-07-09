import { Module } from '@nestjs/common';
import { MeAnunciosModule } from './anuncios/me.anuncios.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
	imports: [MeAnunciosModule],
	controllers: [MeController],
	providers: [MeService],
})
export class MeModule {}
