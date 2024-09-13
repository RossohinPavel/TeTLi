"""Набор скриптов для редактирования задачи"""
import asyncio

from aiogram import Router, types, F
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.context import FSMContext

from orm import service
from . import keyboards as kb
from . import utils


update_router = Router(name='__update__')


class TaskState(StatesGroup):
    edit = State()


# ----- Выполнение задачи -----

@update_router.callback_query(lambda c: c.data and c.data.startswith('exec'))
async def execute_task(callback_query: types.CallbackQuery):
    """Ловит калбэк с клавиатуры и выполняет задачу"""
    await service.execute_task(callback_query.message.chat.id, callback_query.message.message_id)
    await callback_query.message.delete()
    task = await utils.reduce_task_content(callback_query.message.text)
    await callback_query.answer(text=f'Задача <{task}> выполнена.')


# ----- Смена режима оповещений -----

@update_router.callback_query(lambda c: c.data and c.data.startswith('notice'))
async def change_notification_mode(callback_query: types.CallbackQuery):
    """Ловит калбэк с клавиатуры и выполняет задачу"""
    res = await service.update_notification_mode(callback_query.message.chat.id, callback_query.message.message_id)
    keyboard = callback_query.message.reply_markup
    button = keyboard.inline_keyboard[1][0]
    button.text = kb.NOTIFICATION_BUTTON_PRE + (kb.NOTIFICATION_BUTTON_ON if res else kb.NOTIFICATION_BUTTON_OFF)
    await callback_query.message.edit_reply_markup(reply_markup=keyboard)


# ----- Редактирование задачи -----

@update_router.callback_query(lambda c: c.data and c.data.startswith('edit'))
async def init_edit(callback_query: types.CallbackQuery, state: FSMContext):
    """Инициализация редактирования задачи"""
    await state.set_state(TaskState.edit)
    msg = await callback_query.message.edit_reply_markup(reply_markup=kb.EDIT_KEYBOARD)
    data = {'origin_text': msg.text, 'task_msg': msg, 'query_msg': None}
    await state.set_data(data)


@update_router.callback_query(TaskState.edit, F.data == 'back')
async def restore_task_content(callback_query: types.CallbackQuery, state: FSMContext):
    """Сбросить все изменения и восстановить текст задачи."""
    await _back_to_main_entity(callback_query, state)


@update_router.callback_query(TaskState.edit, F.data == 'save')
async def save_task_content(callback_query: types.CallbackQuery, state: FSMContext):
    """Сохранить изменения в задаче."""
    await _back_to_main_entity(callback_query, state, save=True)


async def _back_to_main_entity(callback_query: types.CallbackQuery, state: FSMContext, save=False):
    """Возвращает к основному сосотоянию задачи и сейвит текст по необходимости"""
    data = await state.get_data()
    await state.clear()
    if save:
        msg = data['task_msg']
        await service.update_task(msg.chat.id, msg.message_id, msg.text)
    else:
        await callback_query.message.edit_text(text=data['origin_text'])
    keyboard = await kb.get_formated_task_keyboard(callback_query.message.text)
    await callback_query.message.edit_reply_markup(reply_markup=keyboard)


@update_router.callback_query(TaskState.edit, F.data == 'content')
async def init_task_edit(callback_query: types.CallbackQuery, state: FSMContext):
    """Инициализация редактирования задачи"""
    text = 'Введите новый текст задачи.'
    msg = await callback_query.message.answer(text=text)
    await state.update_data({'query_msg': msg})


@update_router.message(TaskState.edit, F.text)
async def update_task_content_from_text(message: types.Message, state: FSMContext):
    """Инициирует обновление задачи по отправленному текстовому сообщению"""
    await _update_task_content(message.text, message, state)


@update_router.message(TaskState.edit, F.voice)
async def update_task_content_from_voice(message: types.Message, state: FSMContext):
    """Инициирует обновление задачи по отправленному аудио сообщению."""
    new_text = await utils.get_text_from_voice_message(message)
    await _update_task_content(new_text, message, state)


async def _update_task_content(new_text: str, message: types.Message, state: FSMContext):
    """Непосредственно обновляет задачу"""
    data = await state.get_data()
    # Очистка чата от сообщений
    asyncio.create_task(
        message.bot.delete_messages(
            message.chat.id,
            (message.message_id, data['query_msg'].message_id)
        )
    )
    if new_text != data['task_msg'].text:
        kb = data['task_msg'].reply_markup
        new_msg = await data['task_msg'].edit_text(text=new_text, reply_markup=kb)
        await state.update_data({'task_msg': new_msg})
