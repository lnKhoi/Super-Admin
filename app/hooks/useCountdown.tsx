import {
  useEffect,
  useState,
} from 'react';

export const useCountdown = (initialTime: number) => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isRunning) {
            timer = setInterval(() => {
                if (time > 0) {
                    setTime(time - 1);
                } else {
                    setIsRunning(false);
                }
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isRunning, time]);

    const startCountdown = () => {
        setIsRunning(true);
    };

    const resetCountdown = () => {
        setIsRunning(false);
        setTime(initialTime);
    };

    return {
        time: `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`,
        isRunning,
        startCountdown,
        resetCountdown,
    };
};
