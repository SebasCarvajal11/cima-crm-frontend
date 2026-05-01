import {
  Paper, Typography, Button, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Task as TaskIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { StyledModal, ModalHeader, StatusChip } from './StyledComponents';

export default function TasksModal({ open, onClose, tasks, onUpdateTask }) {
  return (
    <StyledModal open={open} onClose={onClose}>
      <Paper className="flex flex-col h-[90vh]">
        <ModalHeader>
          <Box className="flex items-center gap-4">
            <TaskIcon className="text-3xl" />
            <Typography variant="h5" component="h2" className="font-semibold">
              Tareas del Proyecto
            </Typography>
          </Box>
        </ModalHeader>

        <Box className="p-6 flex-grow overflow-auto">
          <TableContainer
            className="rounded shadow-sm"
            sx={{
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-brand-primary">Descripción</TableCell>
                  <TableCell className="font-semibold text-brand-primary">Estado</TableCell>
                  <TableCell className="font-semibold text-brand-primary">Fecha de Creación</TableCell>
                  <TableCell className="font-semibold text-brand-primary">Última Actualización</TableCell>
                  <TableCell className="font-semibold text-brand-primary">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.taskId || task._id}
                    className="transition-all duration-200 hover:bg-black/5 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <StatusChip status={task.status} label={task.status} />
                    </TableCell>
                    <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(task.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Actualizar Estado" arrow>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<UpdateIcon />}
                          onClick={() => onUpdateTask(task)}
                          className="shadow-none hover:shadow-lg"
                        >
                          Actualizar
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {tasks.length === 0 && (
            <Box className="py-16 flex flex-col items-center gap-4">
              <TaskIcon className="text-5xl text-gray-400" />
              <Typography variant="h6" color="text.secondary">
                No hay tareas asignadas para este proyecto
              </Typography>
            </Box>
          )}
        </Box>

        <Box className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            startIcon={<CloseIcon />}
            className="shadow-none hover:shadow-lg"
          >
            Cerrar
          </Button>
        </Box>
      </Paper>
    </StyledModal>
  );
}
