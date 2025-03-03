import {
    Skeleton,
} from 'antd';

function ContentCardSkeleton() {
    return (
        <div>
            <Skeleton.Button block style={{ height: 240, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
            <div className={`pt-4 px-4 pb-2 flex flex-col justify-around`}>
                <div className='flex gap-3 items-center '>
                    <Skeleton.Avatar active shape={'circle'} style={{ width: 36, height: 36 }} />
                    <div className='flex flex-col'>
                        <Skeleton.Input active style={{ width: 36, height: 16 }} />
                        <Skeleton.Input active style={{ width: 36, height: 16 }} />
                    </div>
                </div>
                <Skeleton.Button style={{ height: 20, marginTop: 10, marginBottom: 10 }} block active />
                <Skeleton.Button style={{ height: 28, width: 150 }} block active />
                <div className='flex items-center justify-between gap-2 mt-2 mb-4'>
                    <Skeleton.Button active block style={{ height: 80 }} />
                    <Skeleton.Button active block style={{ height: 80 }} />
                </div>
                <div className='flex items-center justify-between'>
                    <Skeleton.Button active style={{ height: 30 }} />

                    <div className='flex items-center gap-2'>
                        <Skeleton.Node active style={{ width: 30, height: 30 }} />
                        <Skeleton.Button active block style={{ height: 30 }} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ContentCardSkeleton
