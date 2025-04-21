import { useState, useEffect } from 'react';

const useFetchData = ({
  fetchFunction,
  dependencies = [],
  initialState = [],
}) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFunction();
        if (res?.success) {
          setData(res.data);
        } else {
          setError(res || 'Server Error: Failed to fetch');
        }
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, setData, loading, error };
};

export default useFetchData;
