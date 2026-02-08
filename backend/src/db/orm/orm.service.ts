import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { config } from '../../config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { tasks, messages } from "../schema";

@Injectable()
export class OrmService {
  private readonly conn;

  constructor() {
    this.conn = drizzle(postgres(config.db.url));
  }

  createTask() {
    return this.conn.transaction(async (tx) => {
      const [task] = await tx
        .insert(tasks)
        .values({telegramId: 1, content: 'test'})
        .returning({id: tasks.id});
      await tx
        .insert(messages)
        .values({messageId: 1, hideDate: new Date(), taskId: task.id});
    })
  }
}
