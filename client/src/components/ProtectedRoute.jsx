import {useRecoilValue} from "recoil";
import { Navigate } from "react-router-dom";
import { authAtom } from "../atoms/authAtom";

export default function ProtectedRoute({children}) {
    const auth = useRecoilValue(authAtom);
    if(!auth.token) return <Navigate to="/login"/>
    return children;
}