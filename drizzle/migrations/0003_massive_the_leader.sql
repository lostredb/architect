CREATE TABLE "applications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"applicantName" text NOT NULL,
	"applicantPhoneNumber" text DEFAULT 'Applicant Anonymous' NOT NULL,
	"applicantEmail" text NOT NULL,
	"applicationTitle" text NOT NULL,
	"applicationMessage" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photos" DROP CONSTRAINT "photos_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE cascade;