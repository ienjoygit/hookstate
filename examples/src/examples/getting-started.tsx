import React from 'react';
import { createStateLink, useStateLink, useStateLinkUnmounted } from '@hookstate/core';

const store = createStateLink(0);

setInterval(() => useStateLinkUnmounted(store).set(p => p + 1), 3000)

export const ExampleComponent = () => {
    const state = useStateLink(store);
    return <p>
        <span><b>Counter value: {state.value}</b> (watch +1 every 3 seconds) </span>
        <button onClick={() => state.set(p => p + 1)}>Increment</button>
    </p>
}
