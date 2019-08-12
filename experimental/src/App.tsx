import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useStateLink, StateLink, createStateLink, Path, useStateWatch, Plugin, PluginTypeMarker } from './lib/UseStateLink';
import { Initial, InitialExtensions } from './lib/plugins/Initial';
import { Logger } from './lib/plugins/Logger';
import { Touched } from './lib/plugins/Touched';
import { Persistence } from './lib/plugins/Persistence';
import { Validator } from './lib/plugins/Validator';

JSON.stringify({ x: 5, y: 6, toJSON() { return this.x + this.y; } });

const state = createStateLink<TaskItem[]>(Array.from(Array(2).keys()).map((i) => ({
    name: 'initial',
    priority: i,
    // toJSON(): any { return this.name + this.priority; }
})))//.with(LocalPersistence('somekey2'));

setInterval(() => {
    // state.use().nested[0].nested.priority.set(p => (p || 0) + 1)
}, 10);

interface TaskItem {
    name: string,
    priority?: number
}

const TaskView = (props: { link: StateLink<TaskItem> }) => {
    // const locallink = props.link;
    const locallink = useStateLink(props.link);
    // const priorityLink = locallink.nested.priority;
    // const nameLink = locallink.nested.name;
    // return <p>
    //     {new Date().toISOString()} {nameLink.value}
    //     <input value={nameLink.value} onChange={v => nameLink.set(v.target.value)} />
    //     <input value={nameLink.value} onChange={v => priorityLink.set(pv => Number(pv) + 1)} />
    // </p>

    return <p>
        {new Date().toISOString()}
        Modified: {locallink.with(Initial).with(Touched)._.name.extended.modified.toString()}
        Touched: {locallink.with(Initial).with(Touched)._.name.extended.touched.toString()}
        <input value={locallink.value.name} onChange={v => locallink.nested.name.set(v.target.value)} />
        <button onClick={v => locallink.nested.priority.set(pv => Number(pv) + 1)} children={'increment'} />
        {/* <input value={'increment priority'} onChange={v => locallink.nested.priority.set(pv => Number(pv) + 1)} /> */}
    </p>
}

const TwiceTaskView = (props: { link: StateLink<TaskItem>, ind: number }) => {
    return <>
        Task number {props.ind} two times:
        <TaskView link={props.link} />
        {/* <TaskView link={props.link} /> */}
    </>;
}

const JsonDump = (props: {link: StateLink<TaskItem[]>}) => {
    const locallink = useStateLink(props.link);
    return <p>
        {new Date().toISOString()} JSON dump for the first 2: {JSON.stringify(locallink.value.slice(0, 2))}
    </p>;
}

const ModifiedStatus = (props: {link: StateLink<TaskItem[], InitialExtensions>}) => {
    const modified = useStateWatch(props.link, (l) => {
        return l.extended.modified
    });
    return <p>
        {new Date().toISOString()} Modified: {modified.toString()}
    </p>;
}

const TouchedStatus = (props: {link: StateLink<TaskItem[], InitialExtensions>}) => {
    const touched = useStateWatch(props.link, (l) => {
        return l.with(Touched).extended.touched
    });
    return <p>
        {new Date().toISOString()} Touched: {touched.toString()}
    </p>;
}

const s = Symbol('Dup');
export function Dup<S, E extends {}>(unused: PluginTypeMarker<S, E>): Plugin<S, E, { log: () => void }> {
    return {
        id: s,
        instanceFactory: () => ({
            extensions: ['log'],
            extensionsFactory: () => ({
                log: () => console.log('')
            })
        })
    }
}

const App = () => {
    // const vl = useStateLink<TaskItem[], { myext: () => void }>(Array.from(Array(2).keys()).map((i) => ({
    //     name: 'initial',
    //     priority: i
    // }))).with(ModifiedPlugin);
    const [value, setValue] = React.useState('');
    const vl = useStateLink(state
        // .with(Persistence('somekey2'))
        )
        // .with(() => ModifiedPlugin<TaskItem[]>())//.with(DisabledTracking)
        .with(Initial)
        .with(Touched)
        // .with(Dup)
        .with(Logger)
        // .with(Validator({
        //     __validate: (current, link) => undefined,
        //     '*': {
        //         __validate: (current, link) => undefined,
        //     }
        // }));
        .with(Validator())
        // .with(Validator((current, link) => undefined,
        //     // '*': {
        //     //     __validate: (current, link) => undefined,
        //     // }
        // ));

        // .with(LocalPersistence('somekey2'));
        // .with2()
        // .with(DisabledTracking)
    // console.log(vl.extended.initialDup);

    const b = vl.nested[0].nested.name.extended;
    // vl.nested[0].nested.name.extended.validate(t => t, '')
    // vl.extended.initial

    // console.log(vl._[Infinity].value)

    return <>
        <p>{new Date().toISOString()} Other App local
        state: <input value={value} onChange={e => setValue(e.target.value)} /></p>
        <ModifiedStatus link={vl} />
        <TouchedStatus link={vl} />
        {/* {value} */}
        <JsonDump link={vl} />
        {
            vl._.map((i, ind) => <TwiceTaskView key={ind} ind={ind} link={i} />)
        }
        <button
            onClick={() => vl.inferred.push({
                name: 'new task',
                priority: 1
            })}
        >
            Add task
        </button>
    </>;
}

export default App;
