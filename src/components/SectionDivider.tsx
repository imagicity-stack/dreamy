import { memo } from "react";

const SectionDivider = () => (
  <div className="w-full flex justify-center py-8" aria-hidden="true">
    <div className="section-divider-line" />
  </div>
);

export default memo(SectionDivider);
