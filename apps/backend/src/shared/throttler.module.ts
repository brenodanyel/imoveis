import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerException, ThrottlerGuard, ThrottlerModule as _ThrottlerModule } from '@nestjs/throttler';

class MyThrottlerGuard extends ThrottlerGuard {
	protected throwThrottlingException() {
		throw new ThrottlerException('Muitas requisições, aguarde um pouco para tentar novamente.');
	}
}

@Module({
	imports: [
		_ThrottlerModule.forRoot({
			ttl: 10,
			limit: 10,
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: MyThrottlerGuard,
		},
	],
})
export class ThrottlerModule {}
