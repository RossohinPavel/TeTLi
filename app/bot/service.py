"""Содержит различные функции обслуживания бота"""
from aiogram import Bot
from time import time
import asyncio
from orm import service
from bot.tasks import keyboards as kb


DELAY = 300 # 5 минут


async def message_resender(bot: Bot):
    """Удаляет и пересылает сообщения."""
    while True:
        start = time()
        # Что-то делаем с задачами
        tasks = await service.get_old_tasks()
        await asyncio.gather(*(_resend_message(bot, task) for task in tasks))
        await service.update_old_tasks(tasks)
        end = time()
        await asyncio.sleep(DELAY - (end - start))


async def _resend_message(bot: Bot, task: service.Task):
    """Пересылает сообщение пользователю. Возвращает id задачи и message_id нового сообщения"""
    try:
        await bot.delete_message(task.telegram_id, message_id=task.message_id)
        keyboard = await kb.get_formated_task_keyboard(task.content)
        msg = await bot.send_message(task.telegram_id, text=task.content, reply_markup=keyboard)
        task.message_id = msg.message_id
    except:
        print('do it quiet mode')
    