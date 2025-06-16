export type Pit = {
  id: number;
  year: number;
  month: number;
  street: string;
  createdAt: string;
  files: PitFile[];
};

export type PitFile = {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  pitId: number;
  createdAt: string;
};
