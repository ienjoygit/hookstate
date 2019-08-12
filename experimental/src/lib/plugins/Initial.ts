
import { Path, DisabledTracking, Plugin, PluginTypeMarker, StateLink } from '../UseStateLink';

import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

export interface InitialExtensions {
    // unfortunately, there is no way in typescript to
    // express generic type parameter, which would change
    // on the result of nested statelink call
    // tslint:disable-next-line: no-any
    readonly initial: any | undefined;
    readonly modified: boolean;
    readonly unmodified: boolean;
}

const PluginID = Symbol('Initial');

// tslint:disable-next-line: function-name
export function Initial<S, E extends {}>(unused: PluginTypeMarker<S, E>): Plugin<S, E, InitialExtensions> {
    return {
        id: PluginID,
        // tslint:disable-next-line: no-any
        instanceFactory: (initialValue: any) => {
            // tslint:disable-next-line: no-any
            let lastCompared: any = undefined;
            let lastResult: boolean | undefined = undefined;
            // tslint:disable-next-line: no-any
            const initialState: any = cloneDeep(initialValue);
            const getInitial = (path: Path) => {
                let result = initialState;
                path.forEach(p => {
                    result = result && result[p];
                });
                return result;
            }
            // tslint:disable-next-line: no-any
            const modified = (l: StateLink<any, E>): boolean => {
                l.with(DisabledTracking)
                const current = l.value;
                const path = l.path;
                if (current === lastCompared && lastCompared !== undefined) {
                    return lastResult!;
                }
                lastCompared = current;
                lastResult = !isEqual(current, getInitial(path))
                return lastResult;
            }
            return {
                onSet: () => {
                    lastCompared = undefined;
                    lastResult = undefined;
                },
                extensions: ['initial', 'modified', 'unmodified'],
                extensionsFactory: (l) => ({
                    get initial() {
                        return getInitial(l.path)
                    },
                    get modified() {
                        return modified(l);
                    },
                    get unmodified() {
                        return !modified(l)
                    },
                })
            }
        }
    }
}
