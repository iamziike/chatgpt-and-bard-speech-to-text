import styles from "./Radio.module.scss";
import { Component, For, JSX } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  options: Array<{
    title: string | JSX.Element;
    value: string;
  }>;
  desc: {
    header: string;
  };
}

const Radio: Component<Props> = (props) => {
  const { desc, options, ...defaultProps } = props;

  return (
    <div class={styles.radio}>
      <div class={styles["radio__desc--title"]}>{desc.header}</div>
      <div class={styles.radio__options}>
        <For each={options}>
          {(option) => (
            <label class={styles.radio__option}>
              <input
                {...defaultProps}
                type="radio"
                name={defaultProps.name}
                value={option.value}
                checked={option.value === props.value}
              />
              <span>{option.title}</span>
            </label>
          )}
        </For>
      </div>
    </div>
  );
};

export default Radio;
