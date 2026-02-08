CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"hide_date" timestamp NOT NULL,
	"task_id" integer
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" integer NOT NULL,
	"content" text NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;