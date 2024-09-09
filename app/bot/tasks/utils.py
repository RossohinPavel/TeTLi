"""Набор утилит для работы с задачами"""
from aiogram import types, Bot
from audio.stt import STT


async def reduce_task_content(text: str) -> str:
    """Сокращает тест задачи до 15 символов"""
    if len(text) > 12:
        text = text[:12] + '...'
    return text


async def get_file_binary(bot: Bot, file_info: str):
    """Возвращает бинарный объект файла"""
    file = await bot.get_file(file_info)
    return await bot.download_file(file.file_path)


async def get_text_from_voice_message(message: types.Message) -> str:
    """Извлечение текста из аудио сообщения"""
    audio_stream = await get_file_binary(message.bot, message.voice.file_id)
    stt_obj = await STT.from_ogg_binary(audio_stream)
    return await stt_obj.recognition()
