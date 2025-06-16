import { NextRequest } from "next/server";

// Type for route handler params
export type RouteParams = {
  params: Promise<{ id: string }>;
};

// Type for page component params
export type PageParams = {
  params: { id: string };
};

// Type for route handler context
export type RouteContext = {
  request: NextRequest;
  params: RouteParams;
};

// Type for page props
export type PageProps = {
  params: { id: string };
};
