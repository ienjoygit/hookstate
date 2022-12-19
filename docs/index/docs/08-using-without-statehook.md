---
id: state-without-usestate
title: Using state without useHookstate hook
sidebar_label: Using state without useHookstate
---

import { PreviewSample } from '../src/PreviewSample'

You can use Hookstate without a hook. It is particularly useful for integration with old class-based React components.
It works with [global](./global-state), [local](./local-state), [nested](./nested-state) and [scoped](./scoped-state) states the same way.

The following example demonstrates how to use a global state without [useHookstate](typedoc-hookstate-core#useHookstate) hook:

<PreviewSample example="global-multiple-consumers-statefragment" />

And the following components are identical in behavior:

Functional component:

```tsx
const globalState = hookstate('');

const MyComponent = () => {
    const state = useHookstate(globalState);
    return <input value={state.value}
        onChange={e => state.set(e.target.value)} />;
}
```

Functional component without a hook:

```tsx
const globalState = hookstate('');

const MyComponent = () => <StateFragment state={globalState}>{
    state => <input value={state.value}
        onChange={e => state.set(e.target.value)}>
}</StateFragment>
```

Class-based component:

```tsx
const globalState = hookstate('');

class MyComponent extends React.Component {
    render() {
        return <StateFragment state={globalState}>{
            state => <input value={state.value}
                onChange={e => state.set(e.target.value)}>
        }</StateFragment>
    }
}
```
