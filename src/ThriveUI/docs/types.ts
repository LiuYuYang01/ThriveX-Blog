import type { ReactNode } from 'react';

export type ThriveProp = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
};

export type ThriveExample = {
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
};

export type ThriveDoc = {
  id: string;
  title: string;
  category: string;
  description: string;
  importCode: string;
  source: string;
  usage: string[];
  props: ThriveProp[];
  examples: ThriveExample[];
  notes?: string[];
};
