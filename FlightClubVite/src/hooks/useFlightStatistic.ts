  import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseDataCalculatorProps<T, R> {
  data: T;
  calculate: (data: T) => R;
}

function useDataCalculator<T, R>({ data, calculate }: UseDataCalculatorProps<T, R>): R {
  const [result, setResult] = useState<R | null>(null);

  // Memoize the calculation function for performance optimization
  const memoizedCalculate = useCallback(calculate, []);

  useEffect(() => {
    const newResult = memoizedCalculate(data);
    setResult(newResult);
  }, [data, memoizedCalculate]);

  return result ?? memoizedCalculate(data); 
}

export default useDataCalculator;