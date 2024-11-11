export interface Project {
  link: string;
  name: string;
  what: string;
  why: string;
  tech: string[];
}

export interface ProjectData {
  projects: Project[];
}
