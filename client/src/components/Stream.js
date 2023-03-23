import React, { useState } from 'react';
import useEventSource from './useEventSource';

function Stream() {
  const [data, setData] = useState();
  useEventSource('http://localhost:3002/stream', setData);

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
