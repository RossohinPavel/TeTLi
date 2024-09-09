"""Набор скриптов для генерации клавиатур"""
from aiogram.utils.keyboard import InlineKeyboardBuilder, InlineKeyboardMarkup, InlineKeyboardButton


def create_task_keyboard(column=False) -> InlineKeyboardMarkup:
    """Формирует клавиатуру для задачи"""
    keyboard = InlineKeyboardBuilder()
    keyboard.button(text='Изменить', callback_data=f'edit')
    keyboard.button(text='Выполнить', callback_data=f'exec')
    keyboard.adjust(1 if column else 2)
    return keyboard.as_markup()


def create_task_edit_keyboard() -> InlineKeyboardMarkup:
    """Генерация клавиатуры для редактирования задачи"""
    keyboard = InlineKeyboardBuilder()
    # keyboard.button(text='Подзадача', callback_data=f'sub')
    keyboard.button(text='Содержание', callback_data=f'content')
    keyboard.adjust(1)
    keyboard.row(
        InlineKeyboardButton(text='Отмена', callback_data='back'),
        InlineKeyboardButton(text='Сохранить', callback_data=f'save'),
        width=2
    )
    return keyboard.as_markup()


# Клавиатуры
TASK_KEYBOARD_ROW = create_task_keyboard()
TASK_KEYBOARD_COLUMN = create_task_keyboard(True)
EDIT_KEYBOARD = create_task_edit_keyboard()


# Длина строки сообщения, по которой кнопки рендерятся в строку
MSG_ROW_LEN = 14


async def get_formated_task_keyboard(text: str) -> InlineKeyboardMarkup:
    """Получение клавиатуры по длинне сообщения"""
    current_max_row_len = max(map(len, text.split('\n')))
    if current_max_row_len > MSG_ROW_LEN:
        return TASK_KEYBOARD_ROW
    return TASK_KEYBOARD_COLUMN
