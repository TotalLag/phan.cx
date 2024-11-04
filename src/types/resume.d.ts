export interface ResumeItem {
  item: string;
  [key: string]: unknown;
}

export interface ResumeJob {
  title: string;
  company: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  work: ResumeItem[];
  [key: string]: unknown;
}

export interface ResumeEducation {
  degree: string;
  name: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  [key: string]: unknown;
}

export interface ResumeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  [key: string]: unknown;
}

export interface ResumeData {
  info: ResumeInfo;
  summary: string[];
  qualifications: ResumeItem[];
  experience: ResumeJob[];
  education?: ResumeEducation[];
  type?: 'strategic' | 'technical';
  [key: string]: unknown;
}

export interface Props {
  resume: ResumeData;
  type: 'strategic' | 'technical';
}
