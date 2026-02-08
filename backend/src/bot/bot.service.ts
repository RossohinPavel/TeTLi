import { Injectable } from "@nestjs/common";
import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/types";
import { OrmService } from "../db/orm/orm.service";


@Injectable()
export class BotService {
  constructor(
    private readonly orm: OrmService,
  ) {}

  getHelloMessage(): string {
    return "Добро пожаловать!\nЭто бот для управления задачами. Чтобы начать работать, просто \
    отправь обычное или аудио сообщение боту.\nДополнительная информация по команде \\help.";
  }

  getHelpMessage(): string {
    return "Чтобы начать работать, просто отправь обычное или аудио сообщение боту.";
  }

  getKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard([
      Markup.button.webApp("✏️ Изменить", "https://heart-coding.loca.lt/apps/"),
      Markup.button.callback("✅ Выполнить", "done"),
    ]);
  }

  async createNewTask() {
    const result = await this.orm.createTask();
    console.log(result);
    return "";
  }
}
