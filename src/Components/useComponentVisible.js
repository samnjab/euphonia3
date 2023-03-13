import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => {
                setIsComponentVisible(false)
            }, 5)
            
        }
        else if (ref.current && ref.current.contains(event.target)) setIsComponentVisible(true)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, [])

    return { ref, isComponentVisible, setIsComponentVisible };
}