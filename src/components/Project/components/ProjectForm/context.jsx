import { createContext, useContext } from 'react';

export const ProjectFormContext = createContext(null);

export function useProjectFormContext() {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error('useProjectFormContext must be used within a ProjectFormProvider');
  }
  return context;
}
