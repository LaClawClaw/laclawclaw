// Type declaration for Google's <model-viewer> web component.
// Loaded as a runtime script in layout.tsx — this file just keeps TS happy.
// React 19 looks up intrinsic elements on React.JSX, not global JSX.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string;
    alt?: string;
    poster?: string;
    loading?: "auto" | "lazy" | "eager";
    reveal?: "auto" | "interaction" | "manual";
    "auto-rotate"?: string | boolean;
    "auto-rotate-delay"?: string | number;
    "rotation-per-second"?: string;
    "camera-controls"?: string | boolean;
    "camera-orbit"?: string;
    "shadow-intensity"?: string | number;
    exposure?: string | number;
    "environment-image"?: string;
    ar?: string | boolean;
    "ios-src"?: string;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}

export {};
