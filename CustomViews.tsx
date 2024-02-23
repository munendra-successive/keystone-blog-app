import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import { CardValueComponent } from "@keystone-6/core/types";
import React from "react";

const CardValue: CardValueComponent = ({ item, field }) => {
  console.log("ok ", item, field);

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  );
};

export { CardValue };
