import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Логгирование запросов
  const logger = new Logger("HTTP");
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook("onResponse", (req, res, done) => {
    logger.log(`${req.ip} "${req.method} ${req.url}" ${res.statusCode}`);
    done();
  });

  await app.listen(3000, "0.0.0.0");
}

void bootstrap();
