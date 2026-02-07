import { ApiModule } from "./api/api.module";
import { AppController } from "./app.controller";
import { BotModule } from "./bot/bot.module";
import { Module } from "@nestjs/common";


@Module({
  imports: [BotModule, ApiModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
