export type ResumeType = 'strategic' | 'technical';

export interface BaseItem {
  item: string;
  metadata?: Record<string, unknown>;
}

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface Location {
  location: string;
}

export interface ResumeItem extends BaseItem {}

export interface ResumeJob extends DateRange, Location {
  title: string;
  company: string;
  work: ResumeItem[];
  metadata?: Record<string, unknown>;
}

export interface ResumeEducation extends DateRange, Location {
  degree: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeData {
  info: ResumeInfo;
  summary: BaseItem[];
  qualifications: ResumeItem[];
  experience: ResumeJob[];
  education?: ResumeEducation[];
  type?: ResumeType;
  metadata?: Record<string, unknown>;
}

export interface ResumeProps {
  resume: ResumeData;
  type: ResumeType;
}
