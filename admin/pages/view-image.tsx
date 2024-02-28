import React from "react";
import { useRouter } from "next/router";

export default function ViewImage() {
  const router = useRouter();
  const { id } = router.query;
  console.log("id is: ", id);

  return (
    <div>
      <img
        src={`/images/${id}.jpg`}
        alt={`Image ${id}`}
        style={{ width: "70%" }}
      />
    </div>
  );
}
