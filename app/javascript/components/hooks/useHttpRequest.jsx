import { useState } from 'react';

const useHttpRequest = (requestParams, dataTransformation) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { url, method, body } = requestParams;

  const sendRequest = async () => {
    setIsLoading(true);
    setErrors([]);
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
        if (keys.includes('transaction_date')) {
          setErrors((prevState) => [...prevState, `Date ${response.data.transaction_date}`]);
        }
        if (keys.includes('payee')) {
          setErrors((prevState) => [...prevState, `Payee ${response.data.payee}`]);
        }
        if (keys.includes('amount_out')) {
          setErrors((prevState) => [...prevState, `Amount out ${response.data.amount_out}`]);
        }
      });
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    errors,
    sendRequest,
  };
};

export default useHttpRequest;
