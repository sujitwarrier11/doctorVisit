import React from "react";
import { TextField, Box } from "@root/src/Components/Atoms";
import { Field } from "react-final-form";
import ErrorMessaging from "@root/src/Components/Molecules/ErrorMessaging";
import withTheme from "@root/src/Components/Atoms/withTheme";

const isRequired = (value) => (value ? undefined : "This is Required");

const FormField = ({
  fieldName,
  errors,
  touched,
  placeholder,
  fieldType,
  theme,
  notRequired,
  ...props
}) => {
  return (
    <Box width="100%" mb="20px">
      <Field
        name={fieldName}
        render={({ input, meta, InputProps }) => (
          <TextField
            placeholder={placeholder}
            input={input}
            meta={meta}
            type={fieldType}
            br="5px"
            fullWidth
            bg={theme.color.mainBg}
            errorColor={theme.color.errorBorder}
            InputLabelProps={{ shrink: true }}
            focusColor={theme.color.RegularTextColor}
            InputProps={{
              disableUnderline: true,
              disableLabel: true,
              ...InputProps,
            }}
            behaviourProps={{
              isRemoveSecondaryLabelDiv: true,
            }}
            {...props}
          />
        )}
        validate={!notRequired && isRequired}
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
