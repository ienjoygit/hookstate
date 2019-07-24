
import { useStateObject } from '..';

import { renderHook, act } from '@testing-library/react-hooks';

type Dict<T> = {
    [key: string]: T
};

test('should update object state', () => {
    const { result } = renderHook(() => useStateObject<Dict<number>>({}));

    act(() => {
        result.current[1].update('1', 1);
    });

    expect(result.current[0]).toStrictEqual({ 1: 1 });
});