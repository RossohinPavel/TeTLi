import { BotService } from "./bot.service";
import { Action, Ctx, Help, On, Start, Update } from "nestjs-telegraf";
import { Context, Types } from "telegraf";
import { Message } from "telegraf/types";


@Update()
export class BotUpdate {
  constructor(
    private readonly service: BotService
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(this.service.getHelloMessage());
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply(this.service.getHelpMessage());
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    const deleteTask = ctx.deleteMessage();
    const kb = this.service.getKeyboard();
    await ctx.reply(ctx.text || "Default message", kb);
    await deleteTask;
    await this.service.createNewTask();
  }

  @On("voice")
  async onVoice(@Ctx() ctx: Context) {
    const message = ctx.message as Message.VoiceMessage;
    await ctx.reply(`Voice message id ${message.voice.file_id}`);
  }

  @Action("edit")
  async onEdit(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.editMessageText("Вы выбрали: Изменить");
  }

  @Action("done")
  async onDone(@Ctx() ctx: Context) {
    await ctx.answerCbQuery("Выполнено!");
    await ctx.deleteMessage();
  }
}
