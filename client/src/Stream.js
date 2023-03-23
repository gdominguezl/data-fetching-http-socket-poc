import React, { useState, useEffect } from 'react';

function Stream() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3002/stream');

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {data && (
        <ul>
          <li>method: {data.method}</li>
          <li>uri: {data.uri}</li>
          <li>replyto: {data.replyto}</li>
          <li>username: {data.username}</li>
        </ul>
      )}
    </div>
  );
}

export default Stream;
