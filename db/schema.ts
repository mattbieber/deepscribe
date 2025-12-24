import { sql } from 'drizzle-orm';
import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
// Main transcripts table
export const transcripts = pgTable(
    'transcripts',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        title: text('transcript_title'),
        transcriptText: text('transcript_text').notNull(),
        llmText: text('llm_text'),
        patientAge: integer('patient_age'),
        patientGender: text('patient_gender'),
        patientEthnicity: text('patient_ethnicity'),
        locCity: text('loc_city'),
        locState: text('loc_state'),
        symptoms: text('symptoms')
            .array()
            .notNull()
            .default(sql`ARRAY[]::text[]`),
        diagnosis: text('diagnosis')
            .array()
            .notNull()
            .default(sql`ARRAY[]::text[]`),
        query: text('query'),

        // Timestamp
        uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
    },
    (table) => [index('idx_uploaded_at').on(table.uploadedAt)],
);

// TypeScript type exports
export type Transcript = typeof transcripts.$inferSelect;
export type NewTranscript = typeof transcripts.$inferInsert;
