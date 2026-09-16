const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs`
function getHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function getJobs(token, filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE}?${params}`, {
        headers: getHeaders(token),
    })
    
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function getStats(token){
    const res = await fetch(`${BASE}/stats`, {
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function createJob(token, data){
    const res = await fetch(BASE, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function updateJob(token, id, data){
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function deleteJob(token, id){
    const res = await fetch(`${BASE}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
}