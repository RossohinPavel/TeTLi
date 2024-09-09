"""Содержит в себе скрипты запросов в sqlalchemy"""
from sqlalchemy import delete, update, select, text
from orm.config import BaseSession, AsyncSession
from functools import wraps
from orm.models import Task


def _session_decorator(func):
    """Декоратор для выдачи сессий на функции"""
    @wraps(func)
    async def inner(*args, **kwargs):
        async with BaseSession() as session:
            try:
                return await func(*args, session=session, **kwargs)
            except Exception as e:
                await session.rollback()
                print(e)
                return str(e)
    return inner


@_session_decorator
async def create_task(telegram_id: int, message_id: int, content: str, session: AsyncSession = None) -> Task:
    """Создание задачи. Возвращает объект задачи"""
    task = Task(telegram_id=telegram_id, message_id=message_id, content=content)
    session.add(task)
    await session.commit()
    return task


@_session_decorator
async def update_task(telegram_id: int, message_id: int, content: str, session: AsyncSession = None):
    """Обновляет задачу."""
    stmt = (
        update(Task).
        where(Task.telegram_id == telegram_id, Task.message_id == message_id).
        values(content=content)
    )
    await session.execute(stmt)
    await session.commit()
    return True


@_session_decorator
async def execute_task(telegram_id: int, message_id: int, session: AsyncSession = None):
    """Выполняет задачу"""
    stmt = (
        delete(Task).
        where(Task.telegram_id == telegram_id, Task.message_id == message_id)
    )
    await session.execute(stmt)
    await session.commit()
    return True


@_session_decorator
async def get_old_tasks(session: AsyncSession = None) -> tuple[Task]:
    """Для получения списка устаревших задач"""
    query = (
        select(Task)
        .where(Task.creation_time < text("TIMEZONE('utc', now() - make_interval(days => 2) + make_interval(mins => 10))"))
    )
    res = await session.execute(query)
    return res.scalars().all()


@_session_decorator
async def update_old_tasks(tasks: list[Task], session: AsyncSession = None):
    """Обновляет список задач"""
    for task in tasks:
        task.creation_time = text("TIMEZONE('utc', now())")
        session.add(task)
    await session.commit()


@_session_decorator
async def update_notification_mode(telegram_id: int, message_id: int, session: AsyncSession = None) -> bool:
    """Меняет статус оповещений и возвращает новое значение"""
    stmt = text("""
        UPDATE public.app_tasks 
        SET notification = NOT notification 
        WHERE telegram_id=:telegram_id AND message_id=:message_id
    """)
    stmt = stmt.bindparams(telegram_id=telegram_id, message_id=message_id)
    await session.execute(stmt)
    await session.commit()
    query = (
        select(Task.notification).
        where(Task.telegram_id == telegram_id, Task.message_id == message_id)
    )
    res = await session.execute(query)
    return res.scalars().first()
