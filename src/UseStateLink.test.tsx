
import { useStateLink } from './UseStateLink';

import { renderHook, act } from '@testing-library/react-hooks';

test('primitive: should rerender used', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink(0)
    });

    expect(result.current.get()).toStrictEqual(0);
    act(() => {
        result.current.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toStrictEqual(1);
});

test('primitive: should rerender used when set to the same', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1
        return useStateLink(0)
    });

    expect(result.current.get()).toStrictEqual(0);
    act(() => {
        result.current.set(p => p);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toStrictEqual(0);
});

test('primitive: should not rerender unused', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink(0)
    });

    act(() => {
        result.current.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()).toStrictEqual(0);
});

test('object: should rerender used', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field1: 0,
            field2: 'str'
        })
    });

    expect(result.current.get().field1).toStrictEqual(0);
    act(() => {
        result.current.nested.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get().field1).toStrictEqual(1);
    expect(Object.keys(result.current.nested)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used via nested', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field1: 0,
            field2: 'str'
        })
    });

    expect(result.current.nested.field1.get()).toStrictEqual(0);
    act(() => {
        result.current.nested.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.nested.field1.get()).toStrictEqual(1);
    expect(Object.keys(result.current.nested)).toEqual(['field1', 'field2']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2']);
});

test('object: should rerender used when set to the same', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field: 1
        })
    });

    expect(result.current.get()).toEqual({ field: 1 });
    act(() => {
        result.current.set(p => p);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({ field: 1 });
    expect(Object.keys(result.current.nested)).toEqual(['field']);
    expect(Object.keys(result.current.get())).toEqual(['field']);
});

test('object: should rerender unused when new element', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field1: 0,
            field2: 'str'
        })
    });

    act(() => {
        result.current.nested['field3'].set(1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual({
        field1: 0,
        field2: 'str',
        field3: 1
    });
    expect(Object.keys(result.current.nested)).toEqual(['field1', 'field2', 'field3']);
    expect(Object.keys(result.current.get())).toEqual(['field1', 'field2', 'field3']);
    expect(result.current.get().field1).toStrictEqual(0);
    expect(result.current.get().field2).toStrictEqual('str');
    expect(result.current.get()['field3']).toStrictEqual(1);
});

test('object: should not rerender unused property', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field1: 0,
            field2: 'str'
        })
    });

    act(() => {
        result.current.nested.field1.set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);
});

test('object: should not rerender unused self', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink({
            field1: 0,
            field2: 'str'
        })
    });

    act(() => {
        result.current.nested.field1.set(2);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get().field1).toStrictEqual(0);
});

test('array: should rerender used', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 5])
    });

    expect(result.current.get()[0]).toStrictEqual(0);
    act(() => {
        result.current.nested[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()[0]).toStrictEqual(1);
    expect(result.current.get()[1]).toStrictEqual(5);
    expect(result.current.nested.length).toEqual(2);
    expect(result.current.get().length).toEqual(2);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1']);
});

test('array: should rerender used via nested', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 0])
    });

    expect(result.current.nested[0].get()).toStrictEqual(0);
    act(() => {
        result.current.nested[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.nested[0].get()).toStrictEqual(1);
    expect(result.current.nested[1].get()).toStrictEqual(0);
    expect(result.current.nested.length).toEqual(2);
    expect(result.current.get().length).toEqual(2);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1']);
});

test('array: should rerender used when set to the same', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 5])
    });

    expect(result.current.get()).toEqual([0, 5]);
    act(() => {
        result.current.set(p => p);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()).toEqual([0, 5]);
    expect(result.current.nested.length).toEqual(2);
    expect(result.current.get().length).toEqual(2);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1']);
});

test('array: should rerender unused when new element', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 5])
    });

    act(() => {
        result.current.nested[2].set(1);
    });
    expect(renderTimes).toStrictEqual(2);
    expect(result.current.get()[0]).toStrictEqual(0);
    expect(result.current.get()[1]).toStrictEqual(5);
    expect(result.current.get()[2]).toStrictEqual(1);
    expect(result.current.nested.length).toStrictEqual(3);
    expect(result.current.get().length).toStrictEqual(3);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1', '2']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1', '2']);
});

test('array: should not rerender unused property', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 0])
    });

    expect(result.current.get()[1]).toStrictEqual(0);
    act(() => {
        result.current.nested[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()[0]).toStrictEqual(0);
    expect(result.current.nested.length).toEqual(2);
    expect(result.current.get().length).toEqual(2);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1']);
});

test('array: should not rerender unused self', async () => {
    let renderTimes = 0
    const { result } = renderHook(() => {
        renderTimes += 1;
        return useStateLink([0, 0])
    });

    act(() => {
        result.current.nested[0].set(p => p + 1);
    });
    expect(renderTimes).toStrictEqual(1);
    expect(result.current.get()[0]).toStrictEqual(0);
    expect(result.current.nested.length).toEqual(2);
    expect(result.current.get().length).toEqual(2);
    expect(Object.keys(result.current.nested)).toEqual(['0', '1']);
    expect(Object.keys(result.current.get())).toEqual(['0', '1']);
});
