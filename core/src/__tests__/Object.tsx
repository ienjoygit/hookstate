import { useHookstate, hookstate, none, isHookstateValue, isHookstate } from '../';

import { renderHook, act } from '@testing-library/react-hooks';

test('object: should rerender used', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);

    expect(isHookstate(result.current)).toStrictEqual(true);
    expect(isHookstateValue(result.current)).toStrictEqual(false);
    expect(isHookstate(result.current.get())).toStrictEqual(false);
    expect(isHookstateValue(result.current.get())).toStrictEqual(true);
    expect(isHookstate(result.current.field1)).toStrictEqual(true);
    expect(isHookstateValue(result.current.field1)).toStrictEqual(false);
    expect(isHookstate(result.current.field1.get())).toStrictEqual(false);
    expect(isHookstateValue(result.current.field1.get())).toStrictEqual(false);

    act(() => {
        result.current.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get().field1).toStrictEqual(1);
    expect(Object.keys(result.current)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
});

test('object: should not crash on toString', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);

    expect(result.current.value.toString()).toBe("[object Object]")
    expect(result.current.toString()).toBe("[object Object]")

    expect(result.current.field1.value.toString()).toBe("0")
    expect(result.current.field1.toString()).toBe("[object Object]")
});

test('object: should not crash on valueOf', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);

    expect(result.current.value.valueOf() === result.current.value).toBe(true)
    expect(result.current.valueOf() === result.current).toBe(true)
});

test('object: should rerender used null', async () => {
    let renderTimes = 0

    const state = hookstate<{ field: string } | null>(null)
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.value?.field).toStrictEqual(undefined);

    act(() => {
        state.set({ field: 'a' });
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()?.field).toStrictEqual('a');
    expect(Object.keys(result.current)).toEqual(['field']);
});

test('object: should rerender used property-hiphen', async () => {
    let renderTimes = 0

    const state = hookstate<{ 'hiphen-property': string }>({ 'hiphen-property': 'value' })
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.value['hiphen-property']).toStrictEqual('value');

    act(() => {
        state['hiphen-property'].set('updated');
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current['hiphen-property'].get()).toStrictEqual('updated');
    expect(Object.keys(result.current)).toEqual(['hiphen-property']);
});

test('object: should rerender used (boolean-direct)', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: true,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(true);

    act(() => {
        result.current.field1.set(p => !p);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get().field1).toStrictEqual(false);
    expect(Object.keys(result.current)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used via nested', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.field1.get()).toStrictEqual(0);

    act(() => {
        result.current.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.field1.get()).toStrictEqual(1);
    expect(Object.keys(result.current)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used via nested global', async () => {
    let renderTimes = 0
    let state = hookstate({
        field1: 0,
        field2: 'str'
    });
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state.field1)
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);

    act(() => {
        result.current.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toStrictEqual(1);

    act(() => {
        state.field2.set("updated");
    });
    // should not rerender as field2 is not used by the hook
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toStrictEqual(1);
    expect(state.field2.get()).toStrictEqual("updated");
});

test('object: should rerender used via nested function', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({} as { field1?: number })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.nested("field1").value).toStrictEqual(undefined);

    act(() => {
        result.current.merge({ field1: 1 });
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.nested("field1").value).toStrictEqual(1);
    expect(Object.keys(result.current)).toEqual(['field1']);
    expect(Object.keys(result.current.get())).toEqual(['field1']);
});

// tslint:disable-next-line: no-any
const TestSymbol = Symbol('TestSymbol') as any;
test('object: should not rerender used symbol properties', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });

    expect(TestSymbol in result.current.get()).toEqual(false)
    expect(TestSymbol in result.current).toEqual(false)
    expect(result.current.get()[TestSymbol]).toEqual(undefined)
    expect(result.current[TestSymbol]).toEqual(undefined)

    expect(() => { (result.current.get() as any).field1 = 100 })
        .toThrow('Error: HOOKSTATE-202 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-202')

    result.current.get()[TestSymbol] = 100

    expect(renderTimes).toStrictEqual(1);
    expect(TestSymbol in result.current.get()).toEqual(false)
    expect(TestSymbol in result.current).toEqual(false)
    expect(result.current.get()[TestSymbol]).toEqual(100);
    expect(Object.keys(result.current)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
    expect(result.current.get().field1).toEqual(0);
});

test('object: should rerender used when set to the same', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field: 1
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toEqual({ field: 1 });

    act(() => {
        result.current.set(p => p);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({ field: 1 });
    expect(Object.keys(result.current)).toEqual(['field']);
    expect(Object.keys(result.current.get())).toEqual(['field']);
});

test('object: should rerender when keys used', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{ field: number, optional?: number } | null>({
            field: 1
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.keys).toEqual(['field']);

    act(() => {
        result.current.ornull!.field.set(p => p);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.keys).toEqual(['field']);

    act(() => {
        result.current.ornull!.optional.set(2);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.keys).toEqual(['field', 'optional']);

    act(() => {
        result.current.set(null);
    });
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.keys).toEqual(undefined);
});

test('object: should rerender unused when new element', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);

    act(() => {
        // tslint:disable-next-line: no-string-literal
        result.current['field3'].set(1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({
        field1: 0,
        field2: 'str',
        field3: 1
    });
    expect(Object.keys(result.current)).toEqual(['field1', 'field2', 'field3']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2', 'field3']);
    expect(result.current.get().field1).toStrictEqual(0);
    expect(result.current.get().field2).toStrictEqual('str');
    // tslint:disable-next-line: no-string-literal
    expect(result.current.get()['field3']).toStrictEqual(1);
});

test('object: should not rerender unused property', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });
    expect(renderTimes).toStrictEqual(1);

    act(() => {
        result.current.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(1);
});

test('object: should not rerender unused self', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str'
        })
    });

    act(() => {
        result.current.field1.set(2);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(2);
});

test('object: should delete property when set to none', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate({
            field1: 0,
            field2: 'str',
            field3: true
        })
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);

    act(() => {
        // deleting existing property
        result.current.field1.set(none);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({ field2: 'str', field3: true });

    act(() => {
        // deleting non existing property
        result.current.field1.set(none);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({ field2: 'str', field3: true });

    act(() => {
        // inserting property
        result.current.field1.set(1);
    });
    expect(renderTimes).toStrictEqual(3);
    expect(result.current.get().field1).toEqual(1);

    act(() => {
        // deleting existing but not used in render property
        result.current.field2.set(none);
    });
    expect(renderTimes).toStrictEqual(4);
    expect(result.current.get()).toEqual({ field1: 1, field3: true });

    // deleting root value makes it promised
    act(() => {
        result.current.set(none)
    })
    expect(result.current.promised).toEqual(true)
    expect(renderTimes).toStrictEqual(5);
});

test('object: should auto save latest state for unmounted', async () => {
    const state = hookstate({
        field1: 0,
        field2: 'str'
    })
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(state)
    });
    const unmountedLink = state
    expect(unmountedLink.field1.get()).toStrictEqual(0);
    expect(result.current.get().field1).toStrictEqual(0);

    act(() => {
        result.current.field1.set(2);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(unmountedLink.field1.get()).toStrictEqual(2);
    expect(result.current.get().field1).toStrictEqual(2);
});

test('object: should set to null', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{} | null>({})
    });

    const _unused = result.current.get()
    act(() => {
        result.current.set(p => null);
        result.current.set(null);
    });
    expect(renderTimes).toStrictEqual(2);
});

test('object: should denull', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{} | null>({})
    });

    const state = result.current.ornull
    expect(state ? state.get() : null).toEqual({})
    act(() => {
        result.current.set(p => null);
        result.current.set(null);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.ornull).toEqual(null)
});

test('object: should return nested state with conflict name', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{ value: number }>({ value: 0 })
    });

    expect(result.current.nested('value').value).toEqual(0)
    expect(result.current.value.value).toEqual(0)
    act(() => {
        result.current.nested('value').set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.nested('value').value).toEqual(1)
    expect(result.current.value.value).toEqual(1)
});

test('object: should return downgraded value for custom object classes', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate(new Date("2022-06-15"))
    });

    expect(result.current.value.getMonth()).toEqual(5)
    expect(result.current.value instanceof Date).toEqual(true)
    act(() => {
        result.current.set(_ => new Date("2022-06-16"));
    });
    expect(renderTimes).toStrictEqual(2);
    expect(() => (result.current as any).getMonth).toThrow('Error: HOOKSTATE-110 [path: /]. See https://hookstate.js.org/docs/exceptions#hookstate-110')
});

test('object: should do destructure', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{ field: number, optional?: number }>({
            field: 1
        })
    });
    expect(renderTimes).toStrictEqual(1);

    let {
        field,
        optional
    } = result.current;
    expect(field.get()).toEqual(1);
    expect(optional.get()).toEqual(undefined);
})

test('object: should do destructure of nullable', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useHookstate<{ field: number, optional?: number } | null>({
            field: 1
        })
    });
    expect(renderTimes).toStrictEqual(1);

    let {
        field,
        optional
    } = result.current.ornull ?? {};
    expect(field?.get()).toEqual(1);
    expect(optional?.get()).toEqual(undefined);
})