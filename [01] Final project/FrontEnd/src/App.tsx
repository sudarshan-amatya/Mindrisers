import { useEffect } from 'react'
import Route from './routes/index'
import axios from 'axios'
function App() {
    useEffect(() => {
        let token = localStorage.getItem('accessToken')
        axios.get('http://localhost:3000/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }, [])
    return (
        <>
            <Route />
        </>
    )
}

export default App
