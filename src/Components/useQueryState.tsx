import { useSearchParams } from 'react-router-dom';

const useSearchParam = (key: string, defaultValue: string): [string, (value?: string) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setter = (value?: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if(value){
      newParams.set(key, value);
      setSearchParams(newParams);
    } else {
      newParams.set(key, defaultValue);
      setSearchParams(newParams);
    }
  };

  const value = searchParams.get(key) || defaultValue;

  return [value, setter];
};

export default useSearchParam;