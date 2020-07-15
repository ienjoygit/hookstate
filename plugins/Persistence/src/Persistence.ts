import { Plugin, StateValueAtRoot, PluginCallbacks, State } from '@hookstate/core';

const PluginID = Symbol('LocalPersistence');

// tslint:disable-next-line: function-name
export function Persistence(localStorageKey: string): (() => Plugin) {
    return () => ({
        id: PluginID,
        init: (state: State<StateValueAtRoot>) => {
            const persisted = localStorage.getItem(localStorageKey);
            if (persisted !== null) {
                const result = JSON.parse(persisted);
                state.set(result);
            } else if (!state.promised && !!!state.error) {
                localStorage.setItem(localStorageKey, JSON.stringify(state.value))
            }
            return {
                onSet: (p) => {
                    if ('state' in p) {
                        localStorage.setItem(localStorageKey, JSON.stringify(p.state));
                    } else {
                        localStorage.removeItem(localStorageKey)
                    }
                }
            } as PluginCallbacks
        }
    })
}
