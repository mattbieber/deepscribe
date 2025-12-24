import Link from 'next/link'
import { uploadAction } from '@/app/actions'
import { UploadComponent } from '@/components/UploadComponent'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getTranscripts } from '@/db/transcripts'

export default async function Home() {
    const uploadFile = async (formData: FormData) => {
        'use server'
        await uploadAction(formData)
    }

    const transcripts = await getTranscripts()

    return (
        <div className="flex gap-12 ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-xl">
                            Patients
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transcripts.map((transcript) => (
                        <TableRow key={transcript.id}>
                            <TableCell>
                                <Link
                                    className="cursor-pointer hover:text-teal-600"
                                    href={`/detail/${transcript.id}`}
                                >
                                    {transcript.title}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <UploadComponent uploadFile={uploadFile} />
        </div>
    )
}
