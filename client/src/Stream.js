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
          <li>id: {data.id}</li>
          <li>name: {data.name}</li>
          <li>age: {data.age}</li>
          <li>
            address:
            <ul>
              <li>street: {data.address.street}</li>
              <li>city: {data.address.city}</li>
              <li>state: {data.address.state}</li>
              <li>country: {data.address.country}</li>
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Stream;
