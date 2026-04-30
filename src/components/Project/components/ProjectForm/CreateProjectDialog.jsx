import React from 'react';
import { ProjectFormProvider } from './Provider';
import { ProjectForm } from './CompoundUI';

export function CreateProjectDialog({ open, onClose, onSubmit }) {
  return (
    <ProjectFormProvider onSubmit={onSubmit} open={open}>
      <ProjectForm.Dialog open={open} onClose={onClose}>
        <ProjectForm.Header title="Crear Nuevo Proyecto" onClose={onClose} />
        <ProjectForm.Content>
          <ProjectForm.ClientSection />
          <ProjectForm.DetailsSection />
          <ProjectForm.StatusSection />
        </ProjectForm.Content>
        <ProjectForm.Actions onCancel={onClose} submitLabel="Crear Proyecto" />
      </ProjectForm.Dialog>
    </ProjectFormProvider>
  );
}
