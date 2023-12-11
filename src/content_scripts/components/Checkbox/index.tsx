import styles from "./Checkbox.module.scss";
import { Component, For, JSX } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  option: { title: string | JSX.Element };
  desc: {
    header: string;
  };
}

const Checkbox: Component<Props> = (props) => {
  return (
    <div class={`${styles.checkbox} ${props.wrapperClassName ?? ""}`}>
      <div class={styles["checkbox__desc--title"]}>{props.desc.header}</div>
      <label class={styles.checkbox__option}>
        <input {...props} type="checkbox" name={props.name} />
        <span>{props.option.title}</span>
      </label>
    </div>
  );
};

export default Checkbox;
