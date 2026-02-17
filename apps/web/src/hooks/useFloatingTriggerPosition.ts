import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

interface FloatingPosition {
  x: number;
  y: number;
}

interface DragState {
  pointerId: number;
  offsetX: number;
  offsetY: number;
}

interface FloatingSize {
  width: number;
  height: number;
}

interface UseFloatingTriggerPositionResult {
  position: FloatingPosition;
  style: CSSProperties;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  setTriggerElement: (element: HTMLElement | null) => void;
}

const POSITION_STORAGE_KEY = 'lcc-help-trigger-position';
const EDGE_PADDING = 16;
const DEFAULT_SIZE: FloatingSize = { width: 56, height: 56 };

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const clampPosition = (position: FloatingPosition, size: FloatingSize): FloatingPosition => {
  if (typeof window === 'undefined') {
    return position;
  }

  return {
    x: clamp(position.x, EDGE_PADDING, window.innerWidth - size.width - EDGE_PADDING),
    y: clamp(position.y, EDGE_PADDING, window.innerHeight - size.height - EDGE_PADDING),
  };
};

const getDefaultPosition = (size: FloatingSize): FloatingPosition => {
  if (typeof window === 'undefined') {
    return { x: EDGE_PADDING, y: EDGE_PADDING };
  }

  return {
    x: window.innerWidth - size.width - EDGE_PADDING,
    y: window.innerHeight - size.height - 96,
  };
};

const parseStoredPosition = (raw: string | null): FloatingPosition | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FloatingPosition>;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') {
      return null;
    }

    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
};

const persistPosition = (position: FloatingPosition): void => {
  localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
};

export const useFloatingTriggerPosition = (): UseFloatingTriggerPositionResult => {
  const sizeRef = useRef<FloatingSize>(DEFAULT_SIZE);
  const dragRef = useRef<DragState | null>(null);
  const positionRef = useRef<FloatingPosition>(getDefaultPosition(DEFAULT_SIZE));

  const [position, setPosition] = useState<FloatingPosition>(() => {
    if (typeof window === 'undefined') {
      return getDefaultPosition(DEFAULT_SIZE);
    }

    const parsed = parseStoredPosition(localStorage.getItem(POSITION_STORAGE_KEY));
    return parsed ? clampPosition(parsed, DEFAULT_SIZE) : getDefaultPosition(DEFAULT_SIZE);
  });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const updatePosition = useCallback((nextPosition: FloatingPosition, shouldPersist: boolean): void => {
    const clamped = clampPosition(nextPosition, sizeRef.current);
    setPosition(clamped);

    if (shouldPersist) {
      persistPosition(clamped);
    }
  }, []);

  const snapToEdge = useCallback((): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const current = positionRef.current;
    const size = sizeRef.current;
    const midpoint = current.x + size.width / 2;
    const snappedX =
      midpoint < window.innerWidth / 2
        ? EDGE_PADDING
        : window.innerWidth - size.width - EDGE_PADDING;

    updatePosition({ x: snappedX, y: current.y }, true);
  }, [updatePosition]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>): void => {
    if (event.button !== 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const setTriggerElement = useCallback((element: HTMLElement | null): void => {
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    updatePosition(positionRef.current, false);
  }, [updatePosition]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent): void => {
      if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      const nextPosition: FloatingPosition = {
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY,
      };

      updatePosition(nextPosition, false);
    };

    const handlePointerUp = (event: PointerEvent): void => {
      if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      dragRef.current = null;
      snapToEdge();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [snapToEdge, updatePosition]);

  useEffect(() => {
    const handleResize = (): void => {
      updatePosition(positionRef.current, true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePosition]);

  const style = useMemo<CSSProperties>(() => {
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };
  }, [position.x, position.y]);

  return {
    position,
    style,
    onPointerDown,
    setTriggerElement,
  };
};
