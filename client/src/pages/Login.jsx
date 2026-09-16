import {useState} from "react";
import {useRecoilState} from "recoil";
import {useNavigate, Link} from "react-router-dom";
import {authAtom} from "../atoms/authAtom";
import {login} from "../api/auth";

export default function Login() {
    const[,setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slowLoad, setSlowLoad] = useState(false);
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        const slowTimer = setTimeout(() => setSlowLoad(true), 8000);
        try{
            const data = await login({email, password});
            clearTimeout(slowTimer);
            setSlowLoad(false);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setAuth({token: data.token, user: data.user});
            
            navigate('/dashboard');
        }catch(err){
            clearTimeout(slowTimer);
            setSlowLoad(false);
            setError(err.error || 'Login failed.');
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="bg-slate-600 h-screen flex justify-center items-center">
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4" onSubmit={handleSubmit}>
                <h1 className="mb-4 font-semibold text-lg">Login</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
                {loading && slowLoad && (
                    <p className="text-sm text-gray-400 text-center">
                        Server is waking up, this may take up to 30 seconds...
                    </p>
                )}
                {error && ( <p className="text-red-500 text-sm mb-4">{error}</p> )}
                <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p>No account? <Link className="underline text-blue-500 hover:text-blue-700" to="/register" >Register</Link></p>
                </div>
            </form>
        </div>
        </div>
    )
}
