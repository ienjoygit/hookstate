---
id: nullable-state
title: Nullable state
sidebar_label: Nullable state
---

import { PreviewSample } from '../src/PreviewSample'

## Dealing with nullable state

If a state can be missing (e.g. nested property is `undefined`) or `null`, checking for null state value is essential before diving into the nested states.

Typescript will fail a compilation if you attempt to work with nested states of a state, which might have `null`/`undefined` state value. For example:

```tsx
interface Task { name: string, priority?: number }

const MyComponent = () => {
    const state = useHookstate<Task | null>(null)
    
    // JS - runtime error, TS - compilation error
    state.name.value
    // JS - runtime error, TS - compilation error
    state.value.name
}
```

Here is the recommended way to check for `null`/`undefined` before unfolding nested states:

```tsx
// type is for clarity, it is inferred by the compiler
const stateOrNull: State<Task> | null = state.ornull
if (stateOrNull) {
    // neither compilation nor runtime errors
    stateOrNull.name.value

    // neither compilation nor runtime errors
    stateOrNull.value.name
}
```

[State.ornull](typedoc-hookstate-core.md#ornull) property is a very convenient way to deal in those cases. Here is an example of a component, which receives a state whose value might be `null`.

```tsx
const MyInputField = (props: { state: State<string | null>}) => {
    const state: State<string> | null = props.state.ornull;
    // state is either null or an instance of State<string>:
    if (!state) {
        // state value was null, do not render form field
        return <></>;
    }
    // state value is an instance of string, can not be null here:
    return <input value={state.value} onChange={(v) => state.set(v.target.value)} />
}
```

[State.ornull](typedoc-hookstate-core.md#ornull) property is just a convenience. Traditional `||` may also work depending on a case. Here is an example of a component, which receives a state whose value might be `null`, but still proceeds with rendering 'state editor':

```tsx
const MyInputField = (props: { state: State<string | null>}) => {
    // state value is an instance of string or null here:
    return <input value={state.value || 'my default'} onChange={(v) => state.set(v.target.value)} />
}
```
