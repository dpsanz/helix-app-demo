import { useEffect, useState } from "react";

export function useTheme(){
    const [theme, setTheme] = useState<'dark' | 'light'>(
        ()=>(localStorage.getItem('helix_theme') as 'dark' | 'light') || 'dark'
    )

    useEffect(()  =>{
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('helix_theme', theme)

    },[theme])

    function toggleTheme() {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme}
}