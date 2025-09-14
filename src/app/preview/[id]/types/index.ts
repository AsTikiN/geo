export interface File {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  createdAt: string;
}

export interface Pit {
  id: number;
  year: string;
  month: string;
  street: string;
  author: string | null;
  createdAt: string;
  updatedAt: string;
  lastFileModification: string | null;
  jobNumber: string;
  files: File[];
}
