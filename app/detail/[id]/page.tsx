import axios from 'axios'
import { Info, StepBack } from 'lucide-react'
import Link from 'next/link'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Transcript } from '@/db/schema'
import { getTranscript } from '@/db/transcripts'

type ApiResult = {
    protocolSection: {
        identificationModule: {
            nctId: string
            orgStudyIdInfo: {
                id: string
            }
            organization: {
                fullName: string
            }
            briefTitle: string
            officialTitle: string
        }
    }
}

type StudyInfo = {
    nctId: string
    orgStudyIdInfo: string
    organization: string
    briefTitle: string
    officialTitle: string
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const result = await getTranscript(id)
    const transcript: Transcript = result[0]
    const queryResult: StudyInfo[] = []

    if (transcript.query) {
        const res = await axios.get(transcript.query)
        const data = await res.data
        if (data.studies && data.studies.length > 0) {
            ;(data.studies as Array<ApiResult>).forEach((study) => {
                const data = study.protocolSection.identificationModule
                queryResult.push({
                    nctId: data.nctId,
                    orgStudyIdInfo: data.orgStudyIdInfo.id,
                    organization: data.organization.fullName,
                    briefTitle: data.briefTitle,
                    officialTitle: data.officialTitle,
                })
            })
        }
    }

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <StepBack size={32} />
                <div className="font-bold text-xl">
                    <Link className="no-underline hover:underline" href="/">
                        Back
                    </Link>
                </div>
            </div>
            <div className="flex w-full max-w-4xl flex-col gap-6">
                <Tabs defaultValue="general">
                    <TabsList>
                        <TabsTrigger className="cursor-pointer" value="general">
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            className="cursor-pointer"
                            value="transcript"
                        >
                            Transcript
                        </TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="trials">
                            Clinical Trials
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient</CardTitle>
                                <CardDescription>
                                    Patient information derived from transcript.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div>
                                    <span className="font-extrabold">Id:</span>{' '}
                                    <span className="text-gray-400">
                                        {transcript.id}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-extrabold">
                                        Name:
                                    </span>{' '}
                                    {transcript.title}
                                </div>
                                <div>
                                    <span className="font-extrabold">Age:</span>{' '}
                                    {transcript.patientAge}
                                </div>
                                <div>
                                    <span className="font-extrabold">
                                        Gender:
                                    </span>{' '}
                                    {transcript.patientGender}
                                </div>
                                <div>
                                    <span className="font-extrabold">
                                        City:
                                    </span>{' '}
                                    {transcript.locCity}
                                </div>
                                <div>
                                    <span className="font-extrabold">
                                        State:
                                    </span>{' '}
                                    {transcript.locState}
                                </div>
                                <hr className="border-teal-200" />
                                <div className="font-bold text-1xl">
                                    Symptoms
                                </div>
                                <div>
                                    {transcript.symptoms.length > 0
                                        ? transcript.symptoms.join(' AND ')
                                        : 'not found'}
                                </div>
                                <div className="font-bold text-1xl">
                                    Diagnosis
                                </div>
                                <div>
                                    {transcript.diagnosis.length > 0
                                        ? transcript.diagnosis.join(' AND ')
                                        : 'not found'}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="transcript">
                        <Card>
                            <CardHeader>
                                <CardTitle>Transcript</CardTitle>
                                <CardDescription>
                                    Uploaded patient-doctor transcript.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-line text-sm">
                                    {transcript.transcriptText}
                                </pre>
                            </CardContent>
                            <CardFooter>dd</CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="trials">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clinical Trials</CardTitle>
                                <CardDescription>
                                    Possible matches from ClinicalTrials.gov.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col text-sm">
                                    {queryResult.map((result) => {
                                        return (
                                            <div
                                                className="p-3 flex flex-col gap-2 border-b border-b-gray-300"
                                                key={result.nctId}
                                            >
                                                <div className="flex flex-col mb-3 gap-3">
                                                    <h3 className="text-2xl">
                                                        {result.briefTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-blue-500 font-bold">
                                                        <Info />
                                                        <a
                                                            className=" no-underline hover:underline"
                                                            target="_blank"
                                                            href={`https://clinicaltrials.gov/study/${result.nctId}`}
                                                        >
                                                            More Info
                                                        </a>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-extrabold">
                                                        NctId
                                                    </div>{' '}
                                                    {result.nctId}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold">
                                                        OrgStudyIdInfo
                                                    </div>{' '}
                                                    {result.orgStudyIdInfo}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold">
                                                        Organization
                                                    </div>{' '}
                                                    {result.organization}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold">
                                                        OfficialTitle
                                                    </div>{' '}
                                                    {result.officialTitle}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    { queryResult.length === 0 && (
                                        <div>No trials found.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
