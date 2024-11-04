export type ResumeType = 'strategic' | 'technical';

export interface Metadata {
  [key: string]: unknown;
}

export interface BaseItem {
  item: string;
  metadata?: Metadata;
}

export interface DateRange {
  dateFrom: string;
  dateTo: string | 'Present';
}

export interface Location {
  location: string;
  remote?: boolean;
}

export interface ResumeItem extends BaseItem {
  highlights?: string[];
}

export interface ResumeJob extends DateRange, Location {
  title: string;
  company: string;
  work: ResumeItem[];
  technologies?: string[];
  metadata?: Metadata;
}

export interface ResumeEducation extends DateRange, Location {
  degree: string;
  name: string;
  major?: string;
  gpa?: number;
  metadata?: Metadata;
}

export interface ResumeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  linkedin?: string;
  github?: string;
  metadata?: Metadata;
}

export interface ResumeData {
  info: ResumeInfo;
  summary: BaseItem[];
  qualifications: ResumeItem[];
  experience: ResumeJob[];
  education?: ResumeEducation[];
  type?: ResumeType;
  metadata?: Metadata;
}

export interface ResumeProps {
  resume: ResumeData;
  type: ResumeType;
}
