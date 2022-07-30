import { useHookstate, extend, hookstate, State } from '@hookstate/core';
import { clonable } from '@hookstate/clonable';
import { comparable } from '@hookstate/comparable';

import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { snapshotable } from './snapshotable';

test('snapshotable: basic test', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        let result = useHookstate({ a: [0, 1], b: [2, 3] }, extend(
            clonable(v => JSON.parse(JSON.stringify(v))),
            comparable((v1, v2) => JSON.stringify(v1).localeCompare(JSON.stringify(v2))),
            snapshotable()
        ))
        result.snapshot(undefined, 'insert') // initial snapshot
        return result;
    });
    expect(renderTimes).toStrictEqual(1);

    act(() => {
        result.current.a[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1); // snapshot should not mark used

    expect(result.current.a[0].modified()).toStrictEqual(true)
    expect(result.current.a[1].modified()).toStrictEqual(false)
    expect(result.current.b[0].modified()).toStrictEqual(false)
    expect(result.current.b[1].modified()).toStrictEqual(false)
    expect(result.current.a[0].unmodified()).toStrictEqual(false)
    expect(result.current.a[1].unmodified()).toStrictEqual(true)
    expect(result.current.b[0].unmodified()).toStrictEqual(true)
    expect(result.current.b[1].unmodified()).toStrictEqual(true)
    expect(result.current.a.modified()).toStrictEqual(true)
    expect(result.current.b.modified()).toStrictEqual(false)
    expect(result.current.modified()).toStrictEqual(true)
    expect(result.current.unmodified()).toStrictEqual(false)

    expect(result.current.a[0].get()).toStrictEqual(1);
    act(() => {
        result.current.a[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.a[0].get()).toStrictEqual(2);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(2);
    expect(result.current.b[1].get()).toStrictEqual(3);

    act(() => {
        result.current.a[1].rollback(); // should not rollback anything
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.a[0].get()).toStrictEqual(2);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(2);
    expect(result.current.b[1].get()).toStrictEqual(3);

    expect(result.current.a[0].modified()).toStrictEqual(true)
    expect(result.current.a[1].modified()).toStrictEqual(false)
    expect(result.current.b[0].modified()).toStrictEqual(false)
    expect(result.current.b[1].modified()).toStrictEqual(false)
    expect(result.current.a[0].unmodified()).toStrictEqual(false)
    expect(result.current.a[1].unmodified()).toStrictEqual(true)
    expect(result.current.b[0].unmodified()).toStrictEqual(true)
    expect(result.current.b[1].unmodified()).toStrictEqual(true)
    expect(result.current.a.modified()).toStrictEqual(true)
    expect(result.current.b.modified()).toStrictEqual(false)
    expect(result.current.modified()).toStrictEqual(true)
    expect(result.current.unmodified()).toStrictEqual(false)

    expect(() => result.current.b.snapshot('1'))
        .toThrow('Creating a new snapshot from a nested state is not allowed.')

    result.current.snapshot('1')
    act(() => {
        result.current.b[0].set(-2);
        expect(result.current.b.snapshot('1')?.value).toStrictEqual([-2, 3]) // should take full object snapshot
        result.current.b[0].set(2);
    });

    act(() => {
        result.current.a[0].rollback();
    });
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.a[0].get()).toStrictEqual(0);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(2);
    expect(result.current.b[1].get()).toStrictEqual(3);

    expect(result.current.a[0].modified()).toStrictEqual(false)
    expect(result.current.a[1].modified()).toStrictEqual(false)
    expect(result.current.b[0].modified()).toStrictEqual(false)
    expect(result.current.b[1].modified()).toStrictEqual(false)
    expect(result.current.a[0].unmodified()).toStrictEqual(true)
    expect(result.current.a[1].unmodified()).toStrictEqual(true)
    expect(result.current.b[0].unmodified()).toStrictEqual(true)
    expect(result.current.b[1].unmodified()).toStrictEqual(true)
    expect(result.current.a.modified()).toStrictEqual(false)
    expect(result.current.b.modified()).toStrictEqual(false)
    expect(result.current.modified()).toStrictEqual(false)
    expect(result.current.unmodified()).toStrictEqual(true)

    act(() => {
        expect(result.current.a.rollback('1')?.value).toStrictEqual([2, 1]);
    });
    expect(renderTimes).toStrictEqual(4);
    expect(result.current.a[0].get()).toStrictEqual(2);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(2);
    expect(result.current.b[1].get()).toStrictEqual(3);

    act(() => {
        result.current.rollback();
        result.current.b.rollback('1');
    });
    expect(renderTimes).toStrictEqual(5);
    expect(result.current.a[0].get()).toStrictEqual(0);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(-2);
    expect(result.current.b[1].get()).toStrictEqual(3);

    act(() => {
        expect(result.current.rollback('2')).toStrictEqual(undefined); // should do nothing as there was no such a snapshot
    });
    expect(renderTimes).toStrictEqual(5);
    expect(result.current.a[0].get()).toStrictEqual(0);
    expect(result.current.a[1].get()).toStrictEqual(1);
    expect(result.current.b[0].get()).toStrictEqual(-2);
    expect(result.current.b[1].get()).toStrictEqual(3);

});
