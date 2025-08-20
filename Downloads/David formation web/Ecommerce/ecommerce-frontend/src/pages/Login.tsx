import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
      <form className="login-form w-full max-w-sm bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        <div className="text-center text-sm text-gray-500 mt-2">
          <Link to="/register" className="hover:underline text-blue-600">Register?</Link>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          <Link to="/forgot-password" className="hover:underline text-blue-600">Forgot password?</Link>
        </div>
      </form>
    </div>
  );}