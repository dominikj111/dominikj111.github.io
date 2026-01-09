import React from "react";
import { Button } from "@ui-components-library/react";

export default function MyComponent() {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => console.log("ui-components-library Button Click")}
    >
      Test UI Lib button
    </Button>
  );
}
