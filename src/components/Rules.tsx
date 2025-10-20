import { memo } from 'react';

const m = () => {
  return (
    <div>
      <h2>m</h2>
    </div>
  );
};

export default memo(m);