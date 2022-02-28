import React, { useCallback } from "react";

import GroupButton from 'src/components/Group/Button';

export default function VariationSelector({
  variant,
  chooseCombination,
}) {
  const selectVariantCombination = useCallback(
    (item) => {
      console.log('select', item);
      chooseCombination(variant.id, item.id);
    },
    [variant, chooseCombination]
  );

  return (
    <div className="flex flex-col">
      <div className="pb-2 font-semibold">
        {variant?.name}
      </div>
      <div>
        <GroupButton
          displayKey="name"
          data={variant?.child}
          onClick={selectVariantCombination}
        />
      </div>
    </div>
  )
}