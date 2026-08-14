import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    glass: 'bg-white/20 text-white backdrop-blur-sm border border-white/20'
  };

  return (
    <span 
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
