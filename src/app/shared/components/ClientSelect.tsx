"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import type { GroupBase, Props } from "react-select";

export function ClientSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[42px] w-full rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
    );
  }

  return (
    <Select
      {...props}
      instanceId={`select-${Math.random().toString(36).substring(7)}`}
    />
  );
}
