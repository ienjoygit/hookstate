import { Plugin, StateLink } from '@hookstate/core';
export interface LoggerExtensions {
    log(): void;
}
export declare function Logger(): Plugin;
export declare function Logger<S>(self: StateLink<S>): LoggerExtensions;
