import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

// components
import GroupButton from "src/components/Group/Button";
import NumberRange from "src/components/form/NumberRange";
import { Checkbox } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import ImgSlider from "src/components/ImgSlider";
import Button from "src/components/Button";

import VariationSelector from './VariationSelector';

// utils
import formatCurrency from "src/helpers/formatCurrency";
import sortArrayByKey from "src/helpers/sortArrayByKey";

export default function VariationDetails(props) {
  const {
    lang,
    item,
    productsOrdered,
    fnSelectProduct,
    fnChangeRangeProduct,
    fnToggleSelectVariant,
  } = props;
  const [combinationList, setCombinationList] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState({
    data: {},
    isFilledAll: false,
  });
  const [variantList, setVariantList] = useState({});
  const [variantSelected, setVariantSelected] = useState({
    meta: {},
    quantity: 0,
  });

  const displayValue = useMemo(
    () => {
      const variantChoosedData = !!variantSelected?.meta?.id ? variantSelected?.meta : item;
      const image = variantChoosedData?.variation_image
        ? [variantChoosedData.variation_image, ...item.images]
        : [...item.images];
      return {
        price: variantChoosedData?.price,
        sale_price: variantChoosedData?.sale_price,
        sale_enabled: variantChoosedData?.sale_enabled,
        sale_percentage: variantChoosedData?.sale_percentage,
        images: image,
      }
    },
    [variantSelected.meta, item]
  );

  const orderState = useMemo(
    () => {
      const isOrdered = productsOrdered?.[`${item.id}_${variantSelected?.meta?.id}`];
      
      return variantSelected?.quantity > 0 && isOrdered
        ? 'update'
        : variantSelected?.quantity > 0
          ? 'buy'
          : variantSelected?.quantity === 0 && isOrdered
            ? 'remove'
            : 'cancel';
    },
    [variantSelected]
  );

  const submitButtonLang = useMemo(
    () => {
      return orderState === 'update'
        ? lang?.btn__update || 'Update'
        : orderState === 'buy'
          ? lang?.btn__buy || 'Buy'
          : orderState === 'remove'
            ? lang?.btn__remove || 'Remove'
            : lang?.btn__back || 'Back';
    },
    [orderState]
  );

  const structuringVariantList = useCallback(
    (variationData) => {
      let selectedMeta = {},
        structuredData = [];
      if (!!variationData.is_multivariation) {
        const combinationList = variationData.combination;
        structuredData = combinationList
          ?.filter((combination) => !combination.parent_id)
          ?.map((combination, idx) => {
            combination.child = combinationList
              .filter((child) => child.parent_id === combination.id)
              .sort(function(a, b) {
                const keyA = a.name,
                  keyB = b.name;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
            selectedMeta[idx] = null;
            return combination;
          });
      } else {
        structuredData = [{
          id: null,
          name: variationData.name,
          child: variationData.options
            .map((variant) => ({
              id: variant.id,
              name: variant.name
            }))
        }]
      }

      setCombinationList(structuredData);
      setSelectedCombination(() => ({
        data: selectedMeta,
        isFilledAll: false,
      }));
    },
    [setCombinationList, setSelectedCombination]
  );

  const structuringVariantCombination = useCallback(
    (variationData) => {
      const options = variationData.options
        .reduce((reducer, item) => {
          const id = !!variationData.is_multivariation
            ? item.variation_options.ids.join('-')
            : item.id;
          reducer[id] =  item;
          if (!!variationData.is_multivariation) {
            const idReverse = item.variation_options.ids.reverse().join('-');
            reducer[idReverse] = item
          }
          return reducer;
        }, {});

      setVariantList(options);
    },
    [setVariantList]
  );

  const chooseCombination = useCallback(
    (combinationId, selectedId) => {
      const combination = Object.values({
        ...selectedCombination.data,
        [combinationId]: selectedId
      });
      const isCombinationFilled = combination.every((data) => !!data);

      if (isCombinationFilled) {
        const selectedId = combination.join("-");
        const variantOnCart = productsOrdered?.[`${item.id}_${variantList[selectedId]?.id}`];
        setVariantSelected((prevState) => ({
          meta: variantList[selectedId],
          quantity: !!variantOnCart
            ? variantOnCart.quantity
            : prevState.quantity > variantList[selectedId].quantity
              ? variantList[selectedId].quantity
              : prevState.quantity > 1
                ? prevState.quantity
                : variantList[selectedId].quantity !== 0
                  ? 1
                  : 0,
        }));
      }
      setSelectedCombination((prevState) => ({
        data: {
          ...prevState.data,
          [combinationId]: selectedId,
        },
        isFilledAll: isCombinationFilled,
      }));
    },
    [selectedCombination, variantList, item]
  );

  const changeRangeQuantity = useCallback(
    (event) => {

      const newQuantity = Number(event.target.value) < 0
        ? variantSelected.meta.quantity
        : (event.target.value > event.target.max)
          ? Number(event.target.max)
          : Number(event.target.value);

      setVariantSelected((prevState) => ({
        ...prevState,
        quantity: newQuantity
      }))
    },
    [variantSelected]
  );

  const handleSubmitProduct = useCallback(() => {
    if (variantSelected.quantity > 0) {
      const productOrdered = {
        ...item,
        orderQuantity: variantSelected.quantity,
      };
      fnSelectProduct(productOrdered, {...variantSelected.meta, isSelected: true})
    }
    fnToggleSelectVariant();
  }, [variantSelected]);

  useEffect(
    () => {
      structuringVariantList(item.variation);
      structuringVariantCombination(item.variation);
    },
    []
  );

  return (
    <section className="pt-4 flex flex-1 flex-col w-full" id="container-variant">
      <section
        className="relative mb-4 flex items-center text-lg"
        onClick={() => fnToggleSelectVariant()}
      >
        <ArrowBack
            className="mr-2"
            style={{ cursor: 'pointer' }}
        />
        <span className="truncate text-bold">
          Choose Variations
        </span>
      </section>
      <section>
        <div
          style={{
            margin: '1rem 0',
            position: 'relative',
            width: '100%',
            paddingTop: '80%'
          }}
        >
          <ImgSlider
            images={displayValue.images || []}
            className="product-image"
          />
        </div>
        <div className="flex flex-col mb-4">
          <div className="font-bold">
            {item.name}
          </div>
          {
            displayValue?.sale_enabled && !!displayValue?.sale_percentage ? (
              <>
                <div
                  className="flex items-center"
                >
                  <div className="mr-2 line-through">
                    {formatCurrency(displayValue?.price, item?.currency?.code)}
                  </div>
                  <div
                    className="p-1 text-white bg-red-500"
                    style={{
                      // background: '#e74c3c',
                      borderRadius: '0.5rem',
                    }}
                  >
                    {`${Math.round(displayValue?.sale_percentage)}%`}
                  </div>
                </div>
                <div className="font-semibold text-primary-orange">
                  {formatCurrency(displayValue?.sale_price, item?.currency?.code)}
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-primary-orange">
                  {formatCurrency(displayValue?.price, item?.currency?.code)}
                </div>
              </>
            )
          }
        </div>
      </section>
      <section className="flex-1">
        <div className="flex flex-col">
          {
            combinationList?.map((items, idx) => (
              <VariationSelector
                idx={idx}
                variant={items}
                chooseCombination={chooseCombination}
              />
            ))
          }
        </div>
        <div className="flex justify-end">
          {
            selectedCombination.isFilledAll && (
              <NumberRange
                name={`${item.id}_${variantSelected?.meta?.id}`}
                min="0"
                max={variantSelected?.meta?.quantity}
                value={variantSelected?.quantity}
                fnChange={changeRangeQuantity}
                // fnChange={() => {}}
              />
            )
          }
        </div>
      </section>
      <section className="sticky bottom-0 py-4 bg-white">
        <Button
          variant={
            orderState === "cancel" || orderState === "remove"
            ? "outlined"
            : "contained"
          }
          color={
            orderState === "cancel" || orderState === "remove"
              ? "secondary"
              : "primary"
          }
          disableElevation
          fullWidth
          onClick={handleSubmitProduct}
          disabled={false}
        >
          {submitButtonLang}
        </Button>
      </section>
    </section>
  )
}