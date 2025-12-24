import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { transcripts } from '@/db/schema'

export async function getTranscripts() {
    const response = db
        .select({
            id: transcripts.id,
            title: transcripts.title,
        })
        .from(transcripts)
    return response
}

export async function getTranscript(transcriptId: string) {
    'use server'
    const response = db
        .select()
        .from(transcripts)
        .where(eq(transcripts.id, transcriptId))
    return response
}
