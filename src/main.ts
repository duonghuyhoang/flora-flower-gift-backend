import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadGlobalMiddleWare } from './common/middlewares/global.middleware';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  loadGlobalMiddleWare(app);
  await app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}
bootstrap();
