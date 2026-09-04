import {useState} from 'react'

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        ()=> localStorage.getItem('helix_loged_in') === 'true'
    )

    function login() {
        localStorage.setItem('helix_loged_in', 'true')
        setIsAuthenticated(true)
    }

    function logout() {
        localStorage.removeItem('helix_loged_in')
        setIsAuthenticated(false)
    }

    return {isAuthenticated, login, logout}
}