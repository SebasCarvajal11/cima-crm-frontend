import { z } from 'zod';
import { VALIDATION } from './index';

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').regex(VALIDATION.EMAIL_REGEX, 'Email no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').regex(VALIDATION.EMAIL_REGEX, 'Email no válido'),
  password: z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
  address: z.string().optional(),
  phone: z.string().optional(),
  contactInfo: z.string().optional(),
  additionalInfo: z.string().optional(),
  plan: z.string().optional(),
});

export const clientEditSchema = z.object({
  contactInfo: z.string().optional(),
  address: z.string().optional(),
  additionalInfo: z.string().optional(),
  plan: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').regex(VALIDATION.EMAIL_REGEX, 'Email no válido'),
  password: z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
  role: z.enum(['Admin', 'Worker'], { required_error: 'El rol es obligatorio' }),
});

export const userEditSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').regex(VALIDATION.EMAIL_REGEX, 'Email no válido'),
  password: z.string().optional(),
  role: z.enum(['Admin', 'Worker'], { required_error: 'El rol es obligatorio' }),
});

export const projectSchema = z.object({
  clientId: z.number({ required_error: 'El cliente es obligatorio' }).min(1, 'Selecciona un cliente'),
  projectName: z.string().min(1, 'El nombre del proyecto es obligatorio'),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const taskSchema = z.object({
  projectId: z.union([z.string(), z.number()], { required_error: 'El proyecto es obligatorio' }).refine((val) => val !== '' && val !== null, 'Selecciona un proyecto'),
  workerId: z.union([z.string(), z.number()], { required_error: 'El trabajador es obligatorio' }).refine((val) => val !== '' && val !== null, 'Selecciona un trabajador'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  status: z.string().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1, 'La pregunta es obligatoria'),
  answer: z.string().min(1, 'La respuesta es obligatoria'),
});
