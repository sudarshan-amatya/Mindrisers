import { useState } from "react";
import logo from "../assets/Mindrisers-removebg-preview.png";
import Joi from "joi";
import axios from "axios";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function SignupPage() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const schema = Joi.object({
    firstName: Joi.string().min(2).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
    }),

    lastName: Joi.string().min(2).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
    }),

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

    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
      }),
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = schema.validate(formData, { abortEarly: false });

    if (error) {
      const validationErrors = {};
      error.details.forEach((item) => {
        validationErrors[item.path[0]] = item.message;
      });
      setErrors(validationErrors);
      return;
    }
    setErrors({});


    try {
      const response = await axios.post("http://localhost:4000/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // If backend returns token (auto-login)
      if (response.data?.user?.token) {
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
      }


      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-auto flex items-center justify-center mt-8 ">
      <div className="w-full max-w-max bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <img className="h-12" src={logo} alt="logoImg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500 text-sm">
            Join us and start shopping today
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
          <div className="w-full flex justify-center gap-4">
            <div className="w-1/2">
              <input
                type="text"
                value={formData.firstName}
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="w-1/2">
              <input
                type="text"
                value={formData.lastName}
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>


          <input
            type="email"
            value={formData.email}
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}


          <input
            type="password"
            value={formData.password}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}


          <input
            type="password"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(82,137,99)]"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[rgb(38,146,72)] text-white py-2.5 rounded-lg font-semibold hover:bg-[rgb(82,137,99)] cursor-pointer"
          >
            Sign Up
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
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
