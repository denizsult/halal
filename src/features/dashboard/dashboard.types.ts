import type { ReactNode } from "react";

export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  note: string;
};

export type LatestColumn = {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
};

export type LatestRow = {
  id: string;
  cells: Record<string, ReactNode>;
};

export type LatestTableConfig = {
  title: string;
  columns: LatestColumn[];
  rows: LatestRow[];
  ctaLabel: string;
};

export type ReviewItem = {
  id: string;
  rating: number;
  date: string;
  text: string;
  name: string;
  meta: string;
  avatar?: string;
};

export type ReviewMetric = {
  label: string;
  score: number;
};

export type ReviewReply = {
  name: string;
  time: string;
  text: string;
  likes?: number;
  avatar?: string;
};

export type ReviewThread = {
  id: string;
  name: string;
  avatar?: string;
  time: string;
  rating: number;
  text: string;
  likes: number;
  reply?: ReviewReply;
};

export type GlobalRegion = {
  label: string;
  value: string;
};
