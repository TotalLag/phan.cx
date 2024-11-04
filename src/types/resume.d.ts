export interface ResumeItem {
  item: string;
}

export interface ResumeJob {
  title: string;
  company: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  work: ResumeItem[];
}

export interface ResumeEducation {
  degree: string;
  name: string;
  location: string;
  dateFrom: string;
  dateTo: string;
}

export interface ResumeData {
  type: 'strategic' | 'technical';
  info: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  summary: ResumeItem[];
  qualifications: ResumeItem[];
  experience: ResumeJob[];
  education?: ResumeEducation[];
}
