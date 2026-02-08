import { config } from "../config";
import { OrmService } from "../db/orm/orm.service";
import { BotUpdate } from "./bot.controller";
import { BotService } from "./bot.service";
import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";


@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: config.botToken,
      }),
    }),
  ],
  providers: [OrmService, BotUpdate, BotService],
})
export class BotModule {}
