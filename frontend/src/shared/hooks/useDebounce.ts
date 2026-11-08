import { useEffect, useState } from "react";

export const useDebounce = <T>(val: T, delay: 400) => {
    const [debounced, setDebounced] = useState(val);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setDebounced(val);
        }, delay);

        return () => clearTimeout(timeOutId)
    }, [val, delay])

    return debounced;
}