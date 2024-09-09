"""Набор скриптов для работы с созданием задачи"""
from aiogram import Router, types, F
from orm import service
from . import keyboards as kb
from . import utils


create_router = Router(name='__create_task__')


async def _create_task(message: types.Message, text: str):
    """Создает задачу"""
    await message.delete()
    task_message = await message.answer(text, reply_markup=kb.TASK_KEYBOARD)
    task = await service.create_task(task_message.chat.id, task_message.message_id, task_message.text)
    # В случае, если вернется ошибка.
    if isinstance(task, str):
        task_message.delete()
        await message.answer(text=task)


@create_router.message(F.text)
async def create_task_from_text(message: types.Message):
    """Инициализация создания задачи по текстовому вводу пользователя"""
    await _create_task(message, message.text)


@create_router.message(F.voice)
async def create_task_from_voice(message: types.Message):
    """Создание задачи из аудио сообщения"""
    text = await utils.get_text_from_voice_message(message)
    await _create_task(message, text)
