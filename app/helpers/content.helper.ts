import { Dayjs } from "dayjs";

// Output: [00:00, 00:30, 1:00, 1:30]
export const generateTimeOptions = (selectedDate: Dayjs) => {
    const now = new Date();
    const currentHour = now.getHours();
    const isToday = selectedDate.isSame(now, 'day');
    const currentMinute = now.getMinutes();

    const options = [];
    const startHour = currentHour + 1;

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            const isPast =
                isToday ? hour < startHour || (hour === startHour && minute < currentMinute) : false

            options.push({ value: label, label, disabled: isPast });
        }
    }

    return options;
};

// Input: 1:01
// Output: 2:30
export const getCurrentTime = () => {
    const now = new Date();
    let hour = now.getHours() + 1;
    let minute = now.getMinutes();

    if (hour >= 24) hour = hour % 24;

    if (minute > 0 && minute <= 30) {
        minute = 30;
    } else if (minute > 30) {
        minute = 0;
        hour += 1;
    }
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};