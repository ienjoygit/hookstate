import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useStateLink, StateLink, createStateLink, Path, useStateWatch, DisabledTracking, Plugin, PluginTypeMarker } from './lib/UseStateLink';

import isEqual from 'lodash.isequal';

JSON.stringify({ x: 5, y: 6, toJSON() { return this.x + this.y; } });

const state = createStateLink<TaskItem[]>(Array.from(Array(2).keys()).map((i) => ({
    name: 'initial',
    priority: i,
    // toJSON(): any { return this.name + this.priority; }
})));

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
        {new Date().toISOString()} <input value={locallink.value.name} onChange={v => locallink.nested.name.set(v.target.value)} />
        <button onClick={v => locallink.nested.priority.set(pv => Number(pv) + 1)} children={'increment'} />
        {/* <input value={'increment priority'} onChange={v => locallink.nested.priority.set(pv => Number(pv) + 1)} /> */}
    </p>
}

const TwiceTaskView = (props: { link: StateLink<TaskItem>, ind: number }) => {
    return <>
        Task number {props.ind} two times:
        <TaskView link={props.link} />
        <TaskView link={props.link} />
    </>;
}

const JsonDump = (props: {link: StateLink<TaskItem[]>}) => {
    const locallink = useStateLink(props.link);
    return <p>
        {new Date().toISOString()} JSON dump for the first 2: {JSON.stringify(locallink.value.slice(0, 2))}
    </p>;
}

const ModifiedStatus = (props: {link: StateLink<TaskItem[], InitialExtensions<TaskItem[]>>}) => {
    const modified = useStateWatch(props.link, (l) => {
        l.with(DisabledTracking) // TODO descide if modified should do it internally
        return l.extended.modified;
    });
    return <p>
        {new Date().toISOString()} Modified: {modified.toString()}
    </p>;
}

interface InitialExtensions<S> {
    initial: S | undefined;
    modified: boolean;
    unmodified: boolean;
}

const InitialID = Symbol('Initial');

function Initial<S, E extends {}>(unused: PluginTypeMarker<S, E>): Plugin<S, E, InitialExtensions<S>> {
    return {
        id: InitialID,
        // tslint:disable-next-line: no-any
        instanceFactory: (initialValue: any) => {
            // tslint:disable-next-line: no-any
            let lastCompared: any = undefined;
            let lastResult: boolean | undefined = undefined;
            // tslint:disable-next-line: no-any
            const initial: any = JSON.parse(JSON.stringify(initialValue));
            const getInitial = (path: Path) => {
                let result = initial;
                path.forEach(p => {
                    result = result && result[p];
                });
                return result;
            }
            // const touched: object = {}
            // const setTouched = (path: Path) => {
            //     let result = touched;
            //     path.forEach(p => {
            //         result[p] = result[p] || {}
            //         result = result[p]
            //     });
            // }
            // function setDeepTouched(path: Path, v: object): void {
            //     let result = touched;
            //     path.forEach(p => {
            //         result[p] = result[p] || {}
            //         result = result[p]
            //     });
            //     Object.keys(v).forEach(k => setDe)
            // }
            // const getTouched = (path: Path): object | undefined => {
            //     let result = touched;
            //     path.forEach(p => {
            //         result = result && result![p];
            //     });
            //     return result;
            // }
            // tslint:disable-next-line: no-any
            // function deepEqual(a: any, b: any) {
            //     if ((typeof a === 'object' && a !== null) &&
            //         (typeof b === 'object' && b !== null)) {
            //         const aKeys = Object.keys(a);
            //         const bKeys = Object.keys(b);
            //         if (aKeys.length !== bKeys.length) {
            //             return false;
            //         }
            //         for (const k in a) {
            //             if (!(k in b) || !deepEqual(a[k], b[k])) { return false; }
            //         }
            //         for (const k in b) {
            //             if (!(k in a)) { return false; }
            //         }
            //         return true;
            //     } else {
            //         return a === b;
            //     }
            // }
            // function deepEqualTouched(t: object | undefined, a: any, b: any) {
            //     // console.log(t);
            //     if (t === undefined) {
            //         return true;
            //     }
            //     if ((typeof a === 'object' && a !== null) &&
            //         (typeof b === 'object' && b !== null)) {
            //         const touchedKeys = Object.keys(t);
            //         for (let index = 0; index < touchedKeys.length; index += 1) {
            //             const k = touchedKeys[index];
            //             if (!deepEqualTouched(t[k], a[k], b[k])) { return false; }
            //         }
            //         return true;
            //     } else {
            //         return a === b;
            //     }
            // }
            // function deepVisit(a: any): void {
            //     if (typeof a === 'object' && a !== null) {
            //         // tslint:disable-next-line: forin
            //         for (const k in a) {
            //             deepVisit(a[k])
            //         }
            //     }
            // }
            // tslint:disable-next-line: no-any
            const modified = (current: any, path: Path): boolean => {
                // v.with(DisabledTracking)
                // return !deepEqual(v.value, getInitial(path))
                // return !isEqual(v.value, getInitial(path))
                // JSON.stringify(v.value); // leave trace of used for everything
                // TODO deepEqualTouched is broken when entire object is set
                // return !deepEqualTouched(getTouched(path), v.value, getInitial(path))
                // return !isEqual(v.value, getInitial(path))
                if (current === lastCompared && lastCompared !== undefined) {
                    return lastResult!;
                }
                lastCompared = current;
                lastResult = !isEqual(current, getInitial(path))
                return lastResult;
            }
            return {
                onInit: () => {
                    return undefined;
                },
                onSet: (p, v) => {
                    lastCompared = undefined;
                },
                extensions: ['initial', 'modified', 'unmodified'],
                extensionsFactory: (l) => ({
                    get initial() {
                        return getInitial(l.path)
                    },
                    get modified() {
                        return modified(l.value, l.path);
                    },
                    get unmodified() {
                        return !modified(l.value, l.path)
                    },
                })
            }
        }
    }
}

interface InitialExtensions2<S> {
    initialDup: S | undefined;
}

const Initial2ID = Symbol('Initial2');

function Initial2<S, E extends InitialExtensions<S>>(unused: PluginTypeMarker<S, E>): Plugin<S, E, InitialExtensions2<S>> {
    return {
        id: Initial2ID,
        instanceFactory: () => {
            return {
                extensions: ['initialDup'],
                extensionsFactory: (l) => ({
                    get initialDup() {
                        return l.extended.initial
                    }
                })
            }
        }
    }
}

const App = () => {
    // const vl = useStateLink<TaskItem[], { myext: () => void }>(Array.from(Array(2).keys()).map((i) => ({
    //     name: 'initial',
    //     priority: i
    // }))).with(ModifiedPlugin);
    const [value, setValue] = React.useState('');
    const vl = useStateLink(state)
        // .with(() => ModifiedPlugin<TaskItem[]>())//.with(DisabledTracking)
        .with(Initial)
        .with(Initial2)
        // .with2()
        // .with(DisabledTracking)
    // console.log(vl.extended.initialDup);

    // vl.extended.initial

    return <>
        <p>{new Date().toISOString()} Other App local
        state: <input value={value} onChange={e => setValue(e.target.value)} /></p>
        <ModifiedStatus link={vl} />
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
