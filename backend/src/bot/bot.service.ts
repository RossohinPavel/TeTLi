import { Injectable } from "@nestjs/common";
import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/types";


@Injectable()
export class BotService {
  getHelloMessage(): string {
    return "Добро пожаловать!\nЭто бот для управления задачами. Чтобы начать работать, просто \
    отправь обычное или аудио сообщение боту.\nДополнительная информация по команде \\help.";
  }

  getHelpMessage(): string {
    return "Чтобы начать работать, просто отправь обычное или аудио сообщение боту.";
  }

  getKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
    return Markup.inlineKeyboard([
      Markup.button.callback("✏️ Изменить", "edit"),
      Markup.button.callback("✅ Выполнить", "done"),
    ]);
  }
}
