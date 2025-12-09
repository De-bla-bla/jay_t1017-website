import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_USERNAME = "JayT1017";
  const ADMIN_PASSWORD = "Ametepe1920@";

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set session
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_login_time", new Date().getTime());
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password");
        setPassword("");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl -z-10"></div>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            JT
          </div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-2">JayT1017 Official</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-accent-purple transition text-white"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-accent-purple transition text-white"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <a href="#" className="text-sm text-accent-purple hover:text-accent-pink transition">
            Forgot password?
          </a>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-dark-700 rounded-lg border border-dark-600">
          <p className="text-xs text-gray-400 text-center">
            🔒 Secure Login<br/>
            This is a private admin panel. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
