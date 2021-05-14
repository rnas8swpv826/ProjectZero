import { useState } from 'react';

const useHttpRequest = (requestParams, dataTransformation) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { url, method, body } = requestParams;

  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    const token = document.querySelector("meta[name='csrf-token']").content;
    try {
      const response = await fetch(
        url, {
          method: method || 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
            'Content-Type': 'application/json',
          } || {},
          body: body ? JSON.stringify(body) : null,
        },
      );
      // Config above defaults to GET request without headers and body
      if (!response.ok) {
        throw new Error('Network error.');
      }

      const data = await response.json();
      dataTransformation(data);
    } catch (err) {
      // setError(err.message || 'Something went wrong!'); // Error isn't setting properly
      console.log(err.json());
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttpRequest;
