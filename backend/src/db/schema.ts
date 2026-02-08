import { timestamp } from "drizzle-orm/pg-core";
import { integer, text, serial, pgTable, smallint } from "drizzle-orm/pg-core";

/**
 * Таблица задач
 */
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  telegramId: integer("telegram_id").notNull(),
  content: text("content").notNull(),
  status: smallint("status").notNull().default(0),
});

/**
 * Таблица сообщений.
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull(),
  hideDate: timestamp("hide_date").notNull(),
  taskId: integer("task_id").references(() => tasks.id),
});

