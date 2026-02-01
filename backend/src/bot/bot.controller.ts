import { Action, Ctx, Help, On, Start, Update } from "nestjs-telegraf";
import { Context } from 'telegraf';
import { BotService } from "./bot.service";
import { Message } from "telegraf/types";

@Update()
export class BotUpdate {

  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(this.botService.getHelloMessage());
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply(this.botService.getHelpMessage());
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const message = `Task created: ${ctx.text}`;
    const kb = this.botService.getKeyboard();
    await ctx.reply(message, kb);
  }

  @On('voice')
  async onVoice(@Ctx() ctx: Context) {
    const message = ctx.message as Message.VoiceMessage;
    await ctx.reply(`Voice message id ${message.voice.file_id}`)
  }

  @Action('edit')
  async onEdit(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.editMessageText('Вы выбрали: Изменить');
  }

  @Action('done')
  async onDone(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('Выполнено!');
  }
}