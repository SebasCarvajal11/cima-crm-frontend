import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export const RoleChangeDialog = ({ open, userName, newRole, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ className: "rounded-2xl" }}
  >
    <DialogTitle className="font-bold text-gray-800">
      Confirmar cambio de rol
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Ests a punto de cambiar el rol de <strong>{userName}</strong> a <strong>{newRole}</strong>.
        Este cambio afectar sus permisos de acceso inmediatamente.
      </DialogContentText>
    </DialogContent>
    <DialogActions className="p-4">
      <Button onClick={onClose} className="text-gray-600">
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        className="bg-brand-primary hover:bg-brand-primary-light rounded-lg px-6"
      >
        Confirmar Cambio
      </Button>
    </DialogActions>
  </Dialog>
);
