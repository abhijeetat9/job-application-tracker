import {useState} from "react";
import {useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {authAtom} from "../atoms/authAtom";
import {InputBox} from "../components/InputBox.jsx";
import { createJob } from '../api/jobs'

export default function JobForm() {
    const [auth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        company:  '',
        role:     '',
        status:   'applied',
        location: '',
        url:      '',
        notes:    '',
    })
    const [error,   setError]   = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            console.log('Submitting with token:', auth.token)
            console.log('Form data:', form)
            const job = await createJob(auth.token, form)
            console.log('Job created:', job)
            navigate('/dashboard')
        }catch(err) {
            setError(err.error || 'Failed to create job')
        }finally {
            setLoading(false)
        }
    }

    function handleChange(e) {
        setForm(prev => ({
            ...prev,[e.target.name]: e.target.value
        }))
    }
    
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/*HEADER*/}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {auth.user?.name}
                    </span>
                    <button onClick={() => navigate(-1)}
                            className="text-sm text-blue-500 hover:text-blue-700 font font-medium">
                        Go Back
                    </button>
                </div>
            </header>
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 leading-8">Add Application</h2>
                    <form onSubmit={handleSubmit} className="w-full max-w-lg">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <InputBox label={"Company"} name={"company"} value={form.company} onChange={handleChange} isRequired>Company</InputBox>
                                <InputBox label={"Role"} name={"role"} value={form.role} onChange={handleChange} isRequired>Role</InputBox>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-1 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="status" value={form.status} onChange={handleChange} required>
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <InputBox label={"Location"} name={"location"} value={form.location} onChange={handleChange}>Location</InputBox>
                                <InputBox label={"URL"} name={"url"} value={form.url} onChange={handleChange}>URL</InputBox>
                                <InputBox label={"Notes"} name={"notes"} value={form.notes} onChange={handleChange}>Notes</InputBox>
                            </div>
                            
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            {/* fields */}
                            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
                            <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                    
                </div>
            </main>
        </div>
    )
    
}

