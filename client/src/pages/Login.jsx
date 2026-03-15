import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const validationSchema = Yup.object({
    ...(isRegister && {
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
    }),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        login(data.token, data.user);
        navigate("/dashboard");
      } catch (err) {
        setServerError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1 className="auth-hero-title">PropertyHub</h1>
        <p className="auth-hero-sub">
          Manage your properties, tenants, and rent — all in one place.
        </p>
        <div className="auth-features">
          <div className="auth-feature-item">Smart Rent Tracking</div>
          <div className="auth-feature-item">Tenant Management</div>
          <div className="auth-feature-item">Performance Reports</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="auth-card-sub">
            {isRegister ? "Sign up to get started" : "Sign in to your account"}
          </p>
          {serverError && <div className="error-banner">{serverError}</div>}
          <form onSubmit={formik.handleSubmit} className="auth-form">
            {isRegister && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  {...formik.getFieldProps("username")}
                  className={
                    formik.touched.username && formik.errors.username
                      ? "input-error"
                      : ""
                  }
                />
                {formik.touched.username && formik.errors.username && (
                  <span className="field-error">{formik.errors.username}</span>
                )}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@propertyhub.com"
                {...formik.getFieldProps("email")}
                className={
                  formik.touched.email && formik.errors.email
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.email && formik.errors.email && (
                <span className="field-error">{formik.errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 chars, uppercase + number"
                {...formik.getFieldProps("password")}
                className={
                  formik.touched.password && formik.errors.password
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.password && formik.errors.password && (
                <span className="field-error">{formik.errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>
          <p className="auth-toggle">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="toggle-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setServerError("");
                formik.resetForm();
              }}
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
