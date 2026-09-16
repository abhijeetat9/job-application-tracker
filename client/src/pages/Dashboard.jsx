import {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import {Link, useNavigate} from "react-router-dom";
import {authAtom} from "../atoms/authAtom";
import {getJobs, getStats, deleteJob, updateJob} from "../api/jobs";

export default function Dashboard() {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    
    function handleEditClick(job){
        setEditingId(job._id)
        setEditForm({
            status: job.status,
            notes: job.notes,
            location: job.location,
        })
    }
    
    async function handleEditSave(id){
        try{
            const updated = await updateJob(auth.token, id,editForm)
            setJobs(prev  => prev.map(j => j._id === id ? updated : j))
            setEditingId(null)
            const statsData = await getStats(auth.token)
            setStats(statsData)
        }catch(error){
            alert('Failed to update job');
        }
    }
    
    useEffect(() => {
        async function loadJobs() {
            try{
                const [jobsData, statsData] = await Promise.all([
                    getJobs(auth.token),
                    getStats(auth.token),
                ])
                setJobs(jobsData)
                setStats(statsData)
            }catch(err){
                setError('Failed to load data');
            }finally{
                setLoading(false);
            }
        }
        loadJobs();
    },[auth.token])
    
    function handleLogout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({token: null, user: null});
        navigate("/login");
    }
    
    async function handleDelete(id){
        try{
            await deleteJob(auth.token, id)
            setJobs(prev => prev.filter(j => j._id !== id))
        }catch(err){
            alert("Error deleting job");
        }
    }
    
    if(loading) return <div className='p-8'>Loading...</div>
    if(error) return <div className='p-8 text-red-500'>{error}</div>
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/*HEADER*/}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {auth.user?.name}
                    </span>
                    <button onClick={handleLogout} 
                            className="text-sm text-red-600 hover:text-red-700 font font-medium">
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-8 py-8">
                
                {/*STATS*/}
                {stats && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                        {[
                            {label: 'Total', value: stats.total, color: 'text-gray-900'},
                            {label: 'Interviews', value: stats.interview, color: 'text-blue-600'},
                            {label: 'Offers', value: stats.offer, color: 'text-emerald-600'},
                            {label: 'Rejected', value: stats.rejected, color: 'text-red-600'},
                            {label: 'Interview Rate', value: `${stats.interviewRate}%`, color: 'text-indigo-600'},
                            
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className={`text-3xl font-semibold ${s.color}`}>{s.value}</div>
                                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/*Add job button*/}
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className=" text-lg font-semibold text-gray-900">
                        Applications ({jobs.length})
                    </h2>
                    <Link to="/jobs/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">+ Add Job</Link>
                </div>

                {/*Jobs List*/}

                {jobs.map(job => (
                    <div key={job._id} className="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-3">
                        {editingId === job._id ? (
                            // ── EDIT MODE
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="font-semibold text-gray-900">{job.role}</span>
                                <span className="text-sm text-gray-500">{job.company}</span>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Notes"
                                    value={editForm.notes}
                                    onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                                />
                                <button
                                    onClick={() => handleEditSave(job._id)}
                                    className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            // ── VIEW MODE
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-900">{job.role}</div>
                                    <div className="text-sm text-gray-500">{job.company}</div>
                                    {job.notes && <div className="text-xs text-gray-400 mt-1">{job.notes}</div>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={job.status} />
                                    <button
                                        onClick={() => handleEditClick(job)}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
        )
}

function StatusBadge({ status }) {
    const styles = {
        applied: 'bg-gray-100 text-gray-700',
        interview: 'bg-blue-100 text-blue-700',
        offer: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-red-100 text-red-700',
    }
    
    return(
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
            {status}
        </span>
    )
}