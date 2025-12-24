CREATE TABLE "transcripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transcript_title" text,
	"transcript_text" text NOT NULL,
	"llm_text" text,
	"patient_age" integer,
	"patient_gender" text,
	"patient_ethnicity" text,
	"loc_city" text,
	"loc_state" text,
	"symptoms" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"diagnosis" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"query" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_uploaded_at" ON "transcripts" USING btree ("uploaded_at");