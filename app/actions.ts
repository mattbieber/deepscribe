'use server'
import { faker } from '@faker-js/faker'
import { generateObject } from 'ai'
import { eq } from 'drizzle-orm'
import { refresh } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { transcripts } from '@/db/schema'

const sysPrompt = `You are a clinical documentation specialist adept at parsing doctor-patient visit transcripts.`

const prompt = `
You are a clinical documentation specialist.  I will upload a transcript of a doctor-patient conversation.  I'd like you to attempt to extract  the following insights from the conversation: symptoms and conditions, diagnosis, patient age, patient city, patient state, patient gender. Present your findings as a json object with a single key for each of the 5 criteria mentioned.  The values for each key should be as follows:  
\n\n
symptoms_and_conditions
diagnosis
A single array of strings, where each string is text you have found as a symptom or condition.  The order of the strings in the array should be what you deem as priority-first and should be limited to at most 2 entries.  If no match is found the  value should benn empty array. This MUST be an array of strings, even if only a single string or no strings are found.
\n
patient_age
number in years or 0 if not found
\n
patient_city
patient_state
patient_gender
string or null if not found
`

export async function uploadAction(formData: FormData) {
    const file = formData.get('transcript') as File
    console.group('CALLLED')
    if (!file) {
        return { success: false, message: 'No transcript found.' }
    }
    const transcript = await file.text()

    try {
        const response = await db
            .insert(transcripts)
            .values({
                title: faker.person.fullName(),
                transcriptText: transcript,
                llmText: '',
                patientAge: 0,
                patientGender: 'unknown',
                patientEthnicity: 'unknown',
                locCity: 'unknown',
                locState: 'unknown',
                query: null,
            })
            .returning({ insertedId: transcripts.id })

        await analyzeTranscriptAndConstructQuery(response[0].insertedId)
    } catch (err) {
        return { success: false, message: err }
    }
    refresh()

    return {
        success: true,
        message: `File ${file.name} uploaded successfully.`,
    }
}

async function analyzeTranscriptAndConstructQuery(transcriptId: string) {
    const transcript = await db
        .select()
        .from(transcripts)
        .where(eq(transcripts.id, transcriptId))

    const transcriptText = transcript[0].transcriptText

    const fullPrompt = `${prompt}\n\n<transcript>${transcriptText}\n`

    try {
        const { object } = await generateObject({
            model: 'anthropic/claude-sonnet-4.5',
            system: sysPrompt,
            prompt: fullPrompt,
            schema: z.object({
                symptoms_and_conditions: z.array(z.string()),
                diagnosis: z.array(z.string()),
                patient_age: z.number(),
                patient_city: z.nullable(z.string()),
                patient_state: z.nullable(z.string()),
                patient_gender: z.nullable(z.string()),
            }),
        })

        const sc = object.symptoms_and_conditions.join(' AND ')

        let query = ''
        if (sc.length > 0) {
            query = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURI(
                sc,
            )}`
        }

        await db
            .update(transcripts)
            .set({
                llmText: JSON.stringify(object),
                patientAge: object.patient_age,
                patientGender: object.patient_gender || 'unknown',
                locCity: object.patient_city || 'unknown',
                locState: object.patient_state || 'unknown',
                symptoms: object.symptoms_and_conditions,
                diagnosis: object.diagnosis,
                query,
            })
            .where(eq(transcripts.id, transcriptId))
    } catch (err) {
        console.error('Error constructing query URL', err)
    }
}
