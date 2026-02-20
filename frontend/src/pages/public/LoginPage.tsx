import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = (location.state as LocationState)?.from?.pathname;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      const fallback = `/dashboard/${user.role}`;
      navigate(from || fallback, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your Mavade Portal account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="student@school.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              className='border border-gray-400 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:cursor-pointer transition duration-200'
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Use your school portal credentials to sign in.
          </p>
          <p className="text-center text-xs text-gray-500 mt-6">
            <Link to="/signup" className='text-blue-500 hover:text-gray-600 hover:shadow'>Create Account</Link> if you haven't.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
