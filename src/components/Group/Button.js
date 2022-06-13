import React, { useCallback, useState, useMemo } from 'react';
import Button from 'src/components/Button/Button';

export default function GroupButton({
  data = [],
  displayKey,
  onClick,
}) {
  const [selected, setSelected] = useState(-1);
  const selectButton = useCallback(
    (item, idx) => {
      setSelected(idx)
      onClick?.(item);
    },
    [setSelected, onClick]
  );
  const isSelected = useCallback(
    (item) => item === selected,
    [selected],
  );

  return (
    <div class="group-button">
      {data.map((item, idx) => (
        <Button
          className={`${isSelected(idx) ? 'active-group-button' : ''}`}
          onClick={() => selectButton(item, idx)}
        >
          {displayKey ? item[displayKey] : item}
        </Button>
      ))}
    </div>
  )
}