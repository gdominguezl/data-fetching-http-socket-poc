import { useEffect } from 'react';

function useEventSource(url: string, setData: React.Dispatch<any>) {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    return () => {
      eventSource.close();
    };
  }, [url, setData]);
}

export default useEventSource;
