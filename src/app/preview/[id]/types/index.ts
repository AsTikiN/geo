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
  createdAt: string;
  updatedAt: string;
  jobNumber: string;
  files: File[];
}
