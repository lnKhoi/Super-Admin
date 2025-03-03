import React from 'react';

type TagColorProps = {
    color: string,
    background: string
    status: string,
    hideCircle?: boolean
}

export default function TagColor({ background, color, status, hideCircle }: TagColorProps) {
    return (
        <div style={{ backgroundColor: background }}
            className={`inline-flex items-center px-4 gap-1 rounded-[50px] h-[28px]`}>
            {!hideCircle && (<div style={{ backgroundColor: color }} className={`w-2 h-2 rounded-[50%]`}></div>)}
            <span style={{ color: color }} className='text-[12px] font-medium capitalize '>{status}</span>
        </div>
    )
}
