import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import { jest } from "@jest/globals";

describe("useDebounce", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it("should return the initial value immediately", () => {
        const { result } = renderHook(() =>
            useDebounce("initial", 400)
        );

        expect(result.current).toBe("initial");
    });

    it("should update the value after the specified delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            {
                initialProps: { value: "initial" },
            }
        );

        rerender({ value: "updated" });

        expect(result.current).toBe("initial");

        act(() => {
            jest.advanceTimersByTime(399);
        });

        expect(result.current).toBe("initial");

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(result.current).toBe("updated");
    });

    it("should cancel the previous timer when the value changes", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            {
                initialProps: { value: "initial" },
            }
        );

        rerender({ value: "first" });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        rerender({ value: "second" });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current).toBe("initial");

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current).toBe("second");
    });
});