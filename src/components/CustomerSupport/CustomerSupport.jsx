import React from 'react';
import { Email as EmailIcon } from '@mui/icons-material';

const CustomerSupport = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] fluid-padding bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden hover:-translate-y-1 transition-transform">
        <div className="bg-gray-950 text-white fluid-padding text-center">
          <h2 className="text-xl sm:text-[1.75rem] font-semibold m-0">Soporte al Cliente</h2>
        </div>
        <div className="fluid-padding-lg flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full flex justify-center items-center mb-5 bg-brand-primary-light/10 text-brand-primary">
            <EmailIcon fontSize="large" />
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-5 leading-relaxed">
            Para cualquier consulta o asistencia, por favor comuníquese con nuestro equipo de soporte al siguiente correo electrónico:
          </p>
          <a
            href="mailto:annyul.editorial@gmail.com"
            className="text-lg sm:text-xl font-semibold text-brand-primary no-underline px-6 py-3 bg-brand-primary-light/10 rounded-full my-2.5 hover:bg-brand-primary-light/20 hover:shadow-md transition-all"
          >
            annyul.editorial@gmail.com
          </a>
          <p className="text-sm sm:text-base text-gray-500 mt-2.5">
            Nuestro equipo estará encantado de ayudarle con cualquier pregunta o problema que pueda tener.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
