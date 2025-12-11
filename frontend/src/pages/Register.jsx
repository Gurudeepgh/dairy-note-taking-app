import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);
        setLoading(true);

        AuthService.register(username, password).then(
            (response) => {
                setMessage(response.data);
                setSuccessful(true);
                setLoading(false);
                setTimeout(() => navigate("/login"), 1500);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
                setLoading(false);
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">
                    Create Account
                </h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/80">Username</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-lg border-none bg-white/20 text-white placeholder-white/50 px-4 py-2 focus:ring-2 focus:ring-rose-300 outline-none transition-all"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-lg border-none bg-white/20 text-white placeholder-white/50 px-4 py-2 focus:ring-2 focus:ring-rose-300 outline-none transition-all"
                            placeholder="Choose a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full transform rounded-lg bg-white py-3 font-bold text-rose-600 mt-4 shadow-lg transition-transform hover:scale-105 hover:bg-rose-50 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>

                    {message && (
                        <div
                            className={`rounded-lg p-3 text-center text-sm text-white ${successful ? "bg-green-500/80" : "bg-red-500/80"
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center text-white/80">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
