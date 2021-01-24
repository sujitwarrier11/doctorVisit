import React from "react";
import { Select, Box } from "@root/src/Components/Atoms";
import { Field } from "react-final-form";
import ErrorMessaging from "@root/src/Components/Molecules/ErrorMessaging";
import withTheme from "@root/src/Components/Atoms/withTheme";
import MenuItem from "@material-ui/core/MenuItem";

const isRequired = (value) => (value ? undefined : "This is Required");

const FormField = ({
  fieldName,
  errors,
  touched,
  placeholder,
  fieldType,
  theme,
  items,
  ...props
}) => {
  return (
    <Box width="100%" mb="20px">
      <Field
        name={fieldName}
        render={({ input, meta, InputProps }) => (
          <Select
            {...input}
            label={placeholder}
            meta={meta}
            br="5px"
            fullWidth
            bg={theme.color.mainBg}
            errorColor={theme.color.errorBorder}
            InputLabelProps={{ shrink: true }}
            focusColor={theme.color.RegularTextColor}
            InputProps={{
              disableUnderline: true,
              disableLabel: true,
              shrink: true,
              ...InputProps,
            }}
            SelectDisplayProps={{
              color: theme.color.RegularTextColor,
            }}
            behaviourProps={{
              isRemoveSecondaryLabelDiv: true,
            }}
            {...props}
          >
            {items?.map((item) => (
              <MenuItem key={item.id} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        )}
        validate={isRequired}
      />
      {errors[fieldName] && touched[fieldName] && (
        <Box pl="3px" pt="3px">
          <ErrorMessaging message={errors[fieldName]} />
        </Box>
      )}
    </Box>
  );
};

export default withTheme(FormField);
