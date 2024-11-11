// Core resume data interfaces
export interface BaseResumeData {
  info: {
    name: string;
    address: string;
    phone?: string;
    email: string;
  };
  type: 'technical' | 'strategic';
  metadata: {
    lastUpdated: string;
  };
  qualifications: Array<{
    item: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    dateFrom: string;
    dateTo: string;
    work: Array<{
      item: string;
    }>;
  }>;
  education?: Array<{
    degree: string;
    name: string;
    location: string;
    dateFrom: string;
    dateTo: string;
  }>;
}

export interface TechnicalResumeData extends BaseResumeData {
  type: 'technical';
  summary: string[];
}

export interface StrategicResumeData extends BaseResumeData {
  type: 'strategic';
  summary: string[];
}

export type ResumeData = TechnicalResumeData | StrategicResumeData;
