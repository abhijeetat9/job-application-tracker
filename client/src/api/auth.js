const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth`

export async function register(data) {
    const res = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
}

export async function login(data){
    const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
} 