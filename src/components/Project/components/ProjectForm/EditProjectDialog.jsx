import { ProjectFormProvider } from './Provider';
import { ProjectForm } from './CompoundUI';

export function EditProjectDialog({ open, onClose, onSubmit, project }) {
  const initialData = project ? {
    clientId: project.clientId || '',
    projectName: project.projectName || '',
    description: project.description || '',
    status: project.status || 'Pending'
  } : null;

  return (
    <ProjectFormProvider key={project?.id || 'new'} onSubmit={onSubmit} initialData={initialData} open={open}>
      <ProjectForm.Dialog open={open} onClose={onClose}>
        <ProjectForm.Header title="Editar Proyecto" onClose={onClose} />
        <ProjectForm.Content>
          <ProjectForm.ClientSection />
          <ProjectForm.DetailsSection />
          <ProjectForm.StatusSection />
        </ProjectForm.Content>
        <ProjectForm.Actions onCancel={onClose} submitLabel="Actualizar Proyecto" />
      </ProjectForm.Dialog>
    </ProjectFormProvider>
  );
}
