
import {
    Path,
    Extension,
    StateValueAtPath,
    StateValueAtRoot,
    State,
    InferStateValueType,
    __State,
    hookstate,
} from '@hookstate/core';

export type SnapshotMode = 'upsert' | 'insert' | 'update' | 'delete' | 'lookup';

export interface Snapshotable<K extends string = string> {
    snapshot(key?: K, mode?: SnapshotMode): State<InferStateValueType<this>> | undefined;
    rollback(key?: K): State<InferStateValueType<this>> | undefined;
    modified(key?: K): boolean;
    unmodified(key?: K): boolean;
}

export function snapshotable<K extends string = string>(options?: {
    onSnapshot?: (s: State<StateValueAtPath>, key: K | undefined, mode: SnapshotMode) => void
}): () => Extension<Snapshotable<K>> {
    return () => ({
        onCreate: (_, dependencies) => {
            const snapshots: Map<K | '___default', State<StateValueAtRoot>> = new Map();
            function getByPath(stateAtRoot: State<StateValueAtRoot>, path: Path) {
                let stateAtPath = stateAtRoot;
                for (let p of path) {
                    let v = stateAtPath.get({ stealth: true })
                    if (Object(v) !== v) {
                        return undefined
                    }
                    stateAtPath = stateAtPath.nested(p);
                };
                return stateAtPath;
            }
            function isModified(s: State<StateValueAtPath>, key: K | '___default') {
                if (dependencies['compare'] === undefined) {
                    throw Error('State is missing Comparable extension');
                }
                let k: K | '___default' = key || '___default';
                let snap = snapshots.get(k)
                if (!snap) {
                    throw Error(`Snapshot does not exist: ${k}`);
                }
                const stateAtPath = getByPath(snap, s.path);
                return dependencies['compare'](s)(stateAtPath && stateAtPath.get({ stealth: true })) !== 0
            }
            return {
                snapshot: (s) => (key, mod) => {
                    const mode = mod || 'upsert'
                    if (dependencies['clone'] === undefined) {
                        throw Error('State is missing Clonable extension');
                    }
                    let k: K | '___default' = key || '___default';
                    let stateAtPath = undefined;
                    let snap = snapshots.get(k)
                    if (mode === 'upsert' ||
                        (mode === 'insert' && !snap) ||
                        (mode === 'update' && snap)) {
                        let v = dependencies['clone'](s)({ stealth: true })
                        if (s.path.length === 0) {
                            // Root state snapshot case
                            stateAtPath = hookstate(v)
                            snapshots.set(k, stateAtPath)
                        } else if (snap) {
                            // Nested state snapshot case
                            stateAtPath = getByPath(snap, s.path)
                            if (!stateAtPath) {
                                throw Error(`Snapshot does not have nested value by path '${s.path.join('/')}' to update`);
                            }
                            stateAtPath.set(v)
                        } else {
                            throw Error('Creating a new snapshot from a nested state is not allowed.');
                        }
                    } else {
                        let snap = snapshots.get(k)
                        if (!snap) {
                            return undefined
                        }
                        if (mode === 'delete') {
                            if (s.path.length !== 0) {
                                throw Error('Deleting a snapshot from a nested state is not allowed.');
                            }
                            snapshots.delete(k) // delete at root only
                        }
                        stateAtPath = getByPath(snap, s.path) // lookup by path
                    }
                    options?.onSnapshot?.(s, key, mode)
                    return stateAtPath
                },
                rollback: (s) => (key) => {
                    let k: K | '___default' = key || '___default';
                    let snap = snapshots.get(k)
                    if (snap) {
                        let stateAtPath = getByPath(snap, s.path);
                        // get cloned, otherwise the state will keep mutation the object from snapshot
                        let tmpState = hookstate(stateAtPath && stateAtPath.get({ stealth: true }));
                        let valueAtPathCloned = dependencies['clone'](tmpState)({ stealth: true })
                        s.set(valueAtPathCloned)
                        return stateAtPath
                    }
                    return undefined
                },
                modified: (s) => (key) => isModified(s, key || '___default'),
                unmodified: (s) => (key) => !isModified(s, key || '___default'),
            }
        }
    })
}
