import Downshift from "downshift";
import { useCallback, useState, useRef, useEffect } from "react";
import classNames from "classnames";
import {
  DropdownPosition,
  GetDropdownPositionFn,
  InputSelectOnChange,
  InputSelectProps,
} from "./types";

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
}: InputSelectProps<TItem>) {
  const [selectedValue, setSelectedValue] = useState<TItem | null>(
    defaultValue ?? null
  );
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });

  const calculateDropdownPosition = useCallback(() => {
    if (dropdownRef.current) {
      const { top, left } = getDropdownPosition(dropdownRef.current);
      setDropdownPosition({ top, left });
    }
  }, []);

  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem) => {
      if (selectedItem === null) {
        return;
      }

      consumerOnChange(selectedItem);
      setSelectedValue(selectedItem);
    },
    [consumerOnChange]
  );

  useEffect(() => {
    calculateDropdownPosition();
  }, [calculateDropdownPosition]);

  return (
    <Downshift<TItem>
      id="RampSelect"
      onChange={onChange}
      selectedItem={selectedValue}
      itemToString={(item) => (item ? parseItem(item).label : "")}
    >
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
        inputValue,
      }) => {
        const toggleProps = getToggleButtonProps();
        const parsedSelectedItem = selectedItem === null ? null : parseItem(selectedItem);

        return (
          <div className="RampInputSelect--root">
            <label className="RampText--s RampText--hushed" {...getLabelProps()}>
              {label}
            </label>
            <div className="RampBreak--xs" />
            <div
              className="RampInputSelect--input"
              onClick={() => {
                calculateDropdownPosition();
                toggleProps.onClick();
              }}
            >
              {inputValue}
            </div>

            <div
              ref={dropdownRef}
              className={classNames("RampInputSelect--dropdown-container", {
                "RampInputSelect--dropdown-container-opened": isOpen,
              })}
              {...getMenuProps()}
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {renderItems()}
            </div>
          </div>
        );

        function renderItems() {
          // Rest of the code remains the same
        }
      }}
    </Downshift>
  );
}

const getDropdownPosition: GetDropdownPositionFn = (target) => {
  // Rest of the code remains the same
  if (target instanceof Element) {
    const { top, left } = target.getBoundingClientRect();
    const { scrollY } = window;
    return {
      top: scrollY + top + 63,
      left,
    };
  }

  return { top: 0, left: 0 };
};
