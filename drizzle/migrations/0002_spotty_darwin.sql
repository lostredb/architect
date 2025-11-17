CREATE TABLE "info" (
	"about" text DEFAULT '',
	"mainFocusOne" text DEFAULT '',
	"mainFocusTwo" text DEFAULT ''
);
--> statement-breakpoint
DROP TABLE "about" CASCADE;