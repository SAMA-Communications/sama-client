import * as m from "motion/react-m";

import { OvalLoader } from "@elements/OvalLoader";

export interface PageLoaderSkeletonProps {
  /** Additional class for the wrapper */
  className?: string;
}

export const PageLoaderSkeleton = ({ className = "" }: PageLoaderSkeletonProps) => {
  return (
    <div
      className={`ui:flex ui:flex-1 ui:items-center ui:justify-center ui:pl-7 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
        <OvalLoader height={100} width={100} color="var(--color-accent-500)" wrapperClassName="" />
      </m.span>
    </div>
  );
};
