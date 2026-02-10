import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../../components/common/Card';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

export function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student', // student or teacher
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const user = await register(formData.email, formData.password, formData.userType as 'student' | 'teacher' | 'admin');
      navigate(`/dashboard/${user.role}`, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <AuthLayout>
      <div className=" flex items-center justify-center px-4 py-12">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-900 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-800">Join Mavade Portal today</p>
          </div>

          <Card>
            <CardBody>
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a
                  </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: '#0066cc', color: 'white' }}
                  className="w-full px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
