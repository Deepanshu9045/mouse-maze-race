import React, { memo } from 'react';

// cellType: 0=path  1=wall  2=cheese  3=mouse  4=trail
const Cell = memo(({ cellType, onClick, isPath }) => {
  let content  = null;
  let cls      = 'cell';

  switch (cellType) {
    case 1:  cls += ' cell--wall';   break;
    case 2:  cls += ' cell--cheese'; content = '🧀'; break;
    case 3:  cls += ' cell--mouse';  content = '🐭'; break;
    case 4:  cls += ' cell--trail';  break;
    default: cls += ' cell--path';   break;
  }

  if (isPath && cellType === 0) cls += ' cell--clickable';

  return (
    <div className={cls} onClick={onClick}>
      {content && <span className="cell__icon">{content}</span>}
    </div>
  );
});

Cell.displayName = 'Cell';
export default Cell;
