import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      // Send the authorization code to parent window
      window.opener?.postMessage(
        {
          type: 'oauth-callback',
          code,
        },
        window.origin
      );

      // Close the popup after sending the message
      window.close();
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Completing authentication, please wait...</p>
    </div>
  );
};

export default AuthCallbackPage;
