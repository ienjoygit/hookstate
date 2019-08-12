
import { DisabledTracking, Plugin, PluginTypeMarker, Path, StateValueAtRoot } from '../UseStateLink';

export interface LoggerExtensions {
    log(): void;
}

const PluginID = Symbol('Logger');

// tslint:disable-next-line: function-name
export function Logger<S, E extends {}>(unused: PluginTypeMarker<S, E>): Plugin<E, LoggerExtensions> {
    return {
        id: PluginID,
        instanceFactory: () => {
            const getAtPath = (v: StateValueAtRoot, path: Path) => {
                let result = v;
                path.forEach(p => {
                    result = result[p];
                });
                return result;
            }
            return {
                onInit: () => {
                    // tslint:disable-next-line: no-console
                    console.log(`[hookstate]: logger attached`);
                },
                onSet: (p, v) => {
                    const newValue = getAtPath(v, p);
                    // tslint:disable-next-line: no-console
                    console.log(
                        `[hookstate]: new value set at path '/${p.join('/')}': ${JSON.stringify(newValue)}`,
                        newValue);
                },
                extensions: ['log'],
                extensionsFactory: (l) => ({
                    log() {
                        l.with(DisabledTracking); // everything is touched by the JSON, so no point to track
                        // tslint:disable-next-line: no-console
                        return console.log(
                            `[hookstate]: current value at path '/${l.path.join('/')}: ${JSON.stringify(l.value)}'`,
                            l.value);
                    }
                })
            }
        }
    }
}
