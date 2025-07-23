import { css, setup } from "goober";
import * as React from "react";
import {
  resolveValue,
  ToasterProps,
  ToastPosition,
  ToastWrapperProps,
} from "../core/types";
import { useToaster } from "../core/use-toaster";
import { prefersReducedMotion } from "../core/utils";
import { ToastBar } from "./toast-bar";

setup(React.createElement);

const ToastWrapper = ({
  id,
  className,
  style,
  onHeightUpdate,
  children,
}: ToastWrapperProps) => {
  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        const updateHeight = () => {
          const height = el.getBoundingClientRect().height;
          onHeightUpdate(id, height);
        };
        updateHeight();
        new MutationObserver(updateHeight).observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      }
    },
    [id, onHeightUpdate]
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

const getPositionStyle = (
  position: ToastPosition,
  offset: number,
  type: string
): React.CSSProperties => {
  const top = position.includes("top");
  const verticalStyle: React.CSSProperties = top ? { top: 0 } : { bottom: 0 };
  let horizontalStyle: React.CSSProperties = {};

  if (position.includes("center")) {
    horizontalStyle = {
      justifyContent: "center",
    };
  } else if (position.includes("right")) {
    horizontalStyle = {
      justifyContent: "flex-end",
    };
  }
  return {
    left: 0,
    right: 0,
    display: "flex",
    position: "absolute",
    width : type === "confirm" ? "100%" : "auto",
    height : type === "confirm" ? "100%" : "auto",
    transition: prefersReducedMotion()
      ? undefined
      : `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

const DEFAULT_OFFSET = 16;
const CONFIRM_OFFSET = 0;

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = "top-center",
  toastOptions,
  gutter,
  children,
  containerStyle,
  containerClassName,
}) => {
  const { toasts, handlers } = useToaster(toastOptions);

  return (
    <div
      id="_rht_toaster"
      style={{
        position: "fixed",
        zIndex: 9999,
        top: toasts[0]?.type === "confirm" ? CONFIRM_OFFSET :  DEFAULT_OFFSET,
        left: toasts[0]?.type === "confirm" ? CONFIRM_OFFSET :  DEFAULT_OFFSET,
        right: toasts[0]?.type === "confirm" ? CONFIRM_OFFSET :  DEFAULT_OFFSET,
        bottom: toasts[0]?.type === "confirm" ? CONFIRM_OFFSET :  DEFAULT_OFFSET,
        pointerEvents: toasts[0]?.type === "confirm" ? "auto" : "none",
        backgroundColor : toasts[0]?.type === "confirm" ? "rgba(0,0,0,0.3)" : "transparent",
        ...containerStyle,
      }}
      className={containerClassName}
      onMouseEnter={handlers.startPause}
      onMouseLeave={handlers.endPause}
    >
      {toasts.map((t) => {
        const toastPosition = t.position ?? position;
        const offset = handlers.calculateOffset(t, {
          reverseOrder,
          gutter,
          defaultPosition: position,
        });
        const positionStyle = getPositionStyle(toastPosition, offset,t.type);

        let renderedToast;
        if (t.type === "custom") {
          renderedToast = resolveValue(t.message, t);
        } else if (children) {
          renderedToast = children(t);
        }  else {
          renderedToast = <ToastBar toast={t} position={toastPosition} />;
        }

        return (
          <ToastWrapper
            id={t.id}
            key={t.id}
            onHeightUpdate={handlers.updateHeight}
            className={t.visible ? activeClass : ""}
            style={positionStyle}
          >
            {renderedToast}
          </ToastWrapper>
        );
      })}
    </div>
  );
};
