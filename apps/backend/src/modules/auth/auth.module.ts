import { Module } from '@nestjs/common';
import { JWTModule } from '../../shared/jwt.module';
import { AuthController } from './auth.controller';
import * as UseCases from './usecases';

@Module({
	imports: [JWTModule],
	controllers: [AuthController],
	providers: Object.values(UseCases),
})
export class AuthModule {}
