import { useRouter } from "@keystone-6/core/admin-ui/router";
import React from "react";

export default function ViewPost() {
  const router = useRouter();
  const id = router.query;
  console.log("id is: ", id);

  return <>Hello bhai</>;
}
