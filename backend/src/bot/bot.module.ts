import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { config } from '../config';
import { BotUpdate } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [TelegrafModule.forRootAsync({
    useFactory: () => ({
      token: config.botToken,
    }),
  })],
  providers: [BotUpdate, BotService]
})
export class BotModule {}
