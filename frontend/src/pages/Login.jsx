import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                navigate("/dashboard");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">
                    Welcome Back
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/80">Username</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-lg border-none bg-white/20 text-white placeholder-white/50 px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition-all"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-lg border-none bg-white/20 text-white placeholder-white/50 px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition-all"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full transform rounded-lg bg-white py-3 font-bold text-indigo-600 mt-4 shadow-lg transition-transform hover:scale-105 hover:bg-indigo-50 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {message && (
                        <div className="rounded-lg bg-red-500/80 p-3 text-center text-sm text-white">
                            {message}
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center text-white/80">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
