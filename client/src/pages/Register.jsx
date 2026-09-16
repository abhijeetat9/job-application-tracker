import {useState} from "react";
import {useRecoilState} from "recoil";
import {useNavigate, Link} from "react-router-dom";
import {authAtom} from "../atoms/authAtom";
import {register} from "../api/auth";

export default function Register() {
    const[,setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await register({name, email, password});
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setAuth({token: data.token, user: data.user});

            navigate('/dashboard');
        } catch (err) {
            setError(err.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="bg-slate-600 h-screen flex justify-center items-center">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4" onSubmit={handleSubmit}>
                    <h1 className="mb-4 text-lg font-semibold">Register</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold">Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={name} onChange={e => setName(e.target.value)} required/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold">Email</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    {error && <p>{error}</p>}
                    <div className="flex justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                    </div>
                    <p className="flex justify-center mt-4">Already have an account? <Link className="underline text-blue-500 hover:text-blue-700" to="/login">Sign in</Link></p>
                </form>
        </div>
        </div>
    )
}