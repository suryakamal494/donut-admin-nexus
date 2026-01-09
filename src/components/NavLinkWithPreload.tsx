import { forwardRef, useCallback } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { preloadRoute } from "@/lib/route-preloader";

interface NavLinkWithPreloadProps extends NavLinkProps {
  to: string;
}

/**
 * A NavLink component that preloads the target route on hover/focus.
 * This eliminates loading skeletons for most navigation scenarios.
 */
const NavLinkWithPreload = forwardRef<HTMLAnchorElement, NavLinkWithPreloadProps>(
  ({ to, onMouseEnter, onFocus, ...props }, ref) => {
    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        preloadRoute(to);
        onMouseEnter?.(e);
      },
      [to, onMouseEnter]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLAnchorElement>) => {
        preloadRoute(to);
        onFocus?.(e);
      },
      [to, onFocus]
    );

    return (
      <NavLink
        ref={ref}
        to={to}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        {...props}
      />
    );
  }
);

NavLinkWithPreload.displayName = "NavLinkWithPreload";

export default NavLinkWithPreload;
