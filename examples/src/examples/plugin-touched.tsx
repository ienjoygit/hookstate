import React from 'react';
import { useStateLink, StateLink, StateMemo } from '@hookstate/core';
import { Initial } from '@hookstate/initial';
import { Touched, TouchedExtensions } from '@hookstate/touched';

export const ExampleComponent = () => {
    const state = useStateLink(['First Task', 'Second Task'])
        .with(Initial)  // enable the plugin, Touched depends on, otherwise compiler error
        .with(Touched); // enable the plugin
    return <>
        <ModifiedStatus state={state} />
        {state.nested.map((taskState, taskIndex) =>
            <TaskEditor key={taskIndex} taskState={taskState} />
        )}
        <p><button onClick={() => state.set(tasks => tasks.concat(['Untitled']))}>
            Add task
        </button></p>
    </>
}

function TaskEditor(props: { taskState: StateLink<string, TouchedExtensions> }) {
    const taskState = useStateLink(props.taskState);
    return <p>
        Last render at: {(new Date()).toISOString()} <br/>
        Is this task touched: {taskState.extended.touched.toString()} <br/>
        <input
            value={taskState.get()}
            onChange={e => taskState.set(e.target.value)}
        />
    </p>
}

function ModifiedStatus(props: { state: StateLink<string[], TouchedExtensions> }) {
    const touched = useStateLink(props.state,
        // StateMemo is optional:
        // it skips rendering when touched status is not changed
        StateMemo((s) => s.extended.touched));
    return <p>
        Last render at: {(new Date()).toISOString()} <br/>
        Is whole current state touched: {touched.toString()} <br/>
    </p>
}
