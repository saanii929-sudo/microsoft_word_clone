import Image from 'next/image'
import React from 'react'

export interface EmptyRecordsProps {
    image: string,
    shortDescription: string,
    longDescription: string,
}

export default function EmptyRecords({ image, shortDescription, longDescription }: EmptyRecordsProps) {
    return (
        <div className='h-[100%] p-10 w-full  flex flex-col justify-center items-center gap-[10px]'>
            <Image src={image} alt={shortDescription} width={240} height={240} />
            <h5 className='text-2xl font-bold '>{shortDescription}</h5>
            <p className='text-gray-500  md:w-[550px] text-center w-fit'>
                {longDescription}
            </p>
        </div>
    )
}
