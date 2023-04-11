import { FormInputLabel, Group, Input } from "./form-input.styles";
const FormInput = ({ label, ...otherProps }) => {
  return (
    <Group>
      <Input {...otherProps} />
      {label && (
        <FormInputLabel shrink={otherProps.length}>{label}</FormInputLabel>
      )}
    </Group>
  );
};
/** For shrink, we passed a truthy and falsly value */
export default FormInput;
