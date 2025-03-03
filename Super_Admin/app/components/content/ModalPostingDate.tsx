import React, { useEffect, useState } from 'react';

import {
    DatePicker,
    Modal,
    Select,
    Space
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { generateTimeOptions, getCurrentTime } from '~/helpers/content.helper';

type ModalPostingDateProps = {
    loading: boolean;
    open: boolean;
    onclose: () => void;
    onApproveContent: (time: Dayjs) => void;
};

function ModalPostingDate({ loading, open, onApproveContent, onclose }: ModalPostingDateProps) {
    const minDateTime = dayjs().add(1, 'hour');
    const [submitTime, setSubmitTime] = useState<Dayjs>(minDateTime);
    const [isValidDate, setIsValidDate] = useState<boolean>(false);

    return (
        <Modal
            width={355}
            confirmLoading={loading}
            onOk={() => submitTime && onApproveContent(submitTime)}
            open={open}
            okButtonProps={{ disabled: submitTime === null }}
            onCancel={onclose}
            title=""
        >
            <div className="flex items-center flex-col justify-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Posting Date</h2>
                <p className="text-sm text-center text-gray-800 mt-1">
                    The date content goes live on influencer's social media platforms.
                </p>
            </div>
            <div className="flex flex-col gap-2 pb-3">
                <span className="text-sm font-semibold text-gray-800 text-left">Posting Date</span>
                <DatePicker
                    onChange={(date) => {
                        !date ? setIsValidDate(true) : setIsValidDate(false)
                        setSubmitTime((prev) => {
                            const time = prev;
                            return dayjs(date).set('hour', time.hour()).set('minute', time.minute());
                        })
                    }}
                    disabledDate={(current) => current && current < minDateTime.startOf('day')}
                    style={{ width: '100%' }}
                    defaultValue={submitTime}
                    format={DATE_TIME_FORMAT}
                />
                <span className="text-sm font-semibold text-gray-800 mt-3 text-left">Time</span>
                <Space wrap direction="vertical">
                    <Select
                        defaultValue={getCurrentTime()}
                        style={{ width: '100%' }}
                        onChange={(time: string): void => {
                            const [hour, minute] = time.split(':').map(Number);
                            setSubmitTime((prev) => prev.set('hour', hour).set('minute', minute));
                        }}
                        options={generateTimeOptions(submitTime)}
                    />
                </Space>
            </div>
        </Modal>
    );
}

export default ModalPostingDate;
