'use client';
import { ArrowBigUpDash } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';

interface Props {
    uploadFile: (formData: FormData) => void;
}

export function UploadComponent({ uploadFile }: Props) {
    const onDrop = useCallback(
        async (files: File[]) => {
            if (files.length === 0) return;
            const file = files[0];
            const formData = new FormData();
            formData.append('transcript', file);
            uploadFile(formData);
        },
        [uploadFile],
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'text/*': [],
        },
    });

    return (
        <Card className="cursor-pointer relative border-2 border-dashed bg-zinc-100 rounded-sm h-40 w-200 flex items-center justify-center transition-colors duration-200 ease-in-out group">
            <section className="container">
                <div
                    {...getRootProps({
                        className:
                            'dropzone h-40 flex flex-col justify-center items-center gap-2 text-gray-500 transition-transform',
                    })}
                >
                    <input {...getInputProps()} />
                    <ArrowBigUpDash
                        className={`transition duration-300 group-hover:-translate-y-3`}
                    />
                    <div className="transition duration-300 group-hover:translate-y-3">
                        <p className="font-bold tracking-tight">
                            UPLOAD TRANSCRIPT
                        </p>
                        <p>Drag or click to upload</p>
                    </div>
                </div>
            </section>
        </Card>
    );
}
