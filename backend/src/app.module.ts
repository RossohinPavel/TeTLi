import { AppController } from "./app.controller";
import { Module } from "@nestjs/common";
import { BotModule } from './bot/bot.module';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [BotModule, AppsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
