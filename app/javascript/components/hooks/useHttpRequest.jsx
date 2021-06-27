import { useState, useCallback } from 'react';

const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const sendRequest = useCallback(async (requestParams, dataTransformation) => {
    setIsLoading(true);
    setErrors([]);
    const { url, method, body } = requestParams;
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
        throw response;
      }

      const data = await response.json();
      dataTransformation(data);
    } catch (err) {
      err.json().then((response) => {
        const keys = Object.keys(response.data);
        // Errors for Transactions component
        if (keys.includes('transaction_date')) {
          setErrors((prevState) => [...prevState, `Date ${response.data.transaction_date}`]);
        }
        if (keys.includes('payee')) {
          setErrors((prevState) => [...prevState, `Payee ${response.data.payee}`]);
        }
        if (keys.includes('amount_out')) {
          setErrors((prevState) => [...prevState, `Amount out ${response.data.amount_out}`]);
        }
        // Error for Accounts component
        if (keys.includes('name')) {
          setErrors((prevState) => [...prevState, `Name ${response.data.name}`]);
        }
      });
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    errors,
    sendRequest,
  };
};

export default useHttpRequest;
