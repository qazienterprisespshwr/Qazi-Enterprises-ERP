import React, { useState } from 'react';
import { User } from '../types';
import { login } from '../services/mockApi';
import { LOGO_BASE64_URL } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await login(emailOrUsername, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
            <img src={LOGO_BASE64_URL} alt="Qazi Enterprises" className="w-24 h-24 mx-auto" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Qazi Enterprises ERP</h1>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-username"
                name="email-username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;