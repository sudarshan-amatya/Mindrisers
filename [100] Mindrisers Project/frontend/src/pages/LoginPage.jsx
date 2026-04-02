import { useState } from "react";
import logo from "../assets/Mindrisers-removebg-preview.png";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";


export default function LoginPage() {
  const { setIsLoggedIn } = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),

    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.pattern.base":
          "Password must be 3–30 characters and contain only letters or numbers",
      }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = schema.validate({ email, password }, { abortEarly: false });

    if (error) {
      const validationErrors = {};
      error.details.forEach((item) => {
        validationErrors[item.path[0]] = item.message;
      });
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError("");

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.msg || data.message || "Invalid username or password");
        return;
      }

      // ✅ save once
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      setServerError("Server error. Please try again.");
    }
  };


  return (
    <div className="h-auto flex items-center justify-center mt-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="">
            <img className="h-12" src={logo} alt="logoImg" />
          </div>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* 🔴 Backend error */}
        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">
            {serverError}
          </p>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[rgb(82,137,99)] focus:ring-[rgb(82,137,99)]"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[rgb(38,146,72)] hover:bg-[rgb(82,137,99)] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <button className="w-full border border-gray-300 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup"
            className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
