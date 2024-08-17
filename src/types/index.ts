import { Timestamp } from "firebase/firestore";

export interface Question {
  id: string;
  p_num: number;
  title: string;
  content: string;
  codeLanguage: string;
  codespace: string | null;
  author: string;
  writer: string;
  solved: boolean;
  createdAt: Date;
}
export interface QuestionListType{
  id: string;
  p_num: number;
  title: string;
  codeLanguage: string;
  solved: boolean;
  createdAt: Date;
  writer: string;
}
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
export interface Comment {
  id: string;
  writer: string;
  questionId: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface problemType {
  p_num: number;
  title: string;
  content: string;
  codeLanguage: string;
  codespace: string | null;
}

export interface problemsType {
  id: string;
  boj_id: string;
  p_num: number;
  p_time: Date;
}

export interface BaseUserState {
  boj_id: string;
  tier?: string;
  name?: string;
}

export interface RatingRankUser extends BaseUserState {
  rating: number;
}

export interface SolvedDiffRankUser extends BaseUserState {
  full_solved_diff: number;
}

export interface RatingDiffRankUser extends BaseUserState {
  rating_diff: number;
}

export type RankType = 'rating' | 'solved_diff' | 'rating_diff';

export interface Problem {
  boj_id: string;
  p_num: string;
  p_tier: number;
  p_time: Timestamp;
}
