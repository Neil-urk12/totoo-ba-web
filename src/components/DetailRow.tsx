import type { ReactNode } from 'react';

interface DetailRowProps {
    label: string;
    value: ReactNode;
    mono?: boolean;
    wrap?: boolean;
    emphasize?: boolean;
    /** When true, label has min-width so values align (used in dense modals) */
    aligned?: boolean;
    /** "row" = horizontal (label left, value right). "field" = vertical (label above, value below, for grid cells). */
    variant?: 'row' | 'field';
}

export default function DetailRow({ label, value, mono, wrap, emphasize, aligned, variant = 'row' }: DetailRowProps) {
    if (variant === 'field') {
        return (
            <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wide opacity-70">{label}</div>
                <div className={`mt-1 text-sm sm:text-base ${mono ? 'font-mono text-xs sm:text-sm' : 'font-medium'} ${wrap ? 'break-words' : ''} ${emphasize ? 'text-green-700 dark:text-green-500' : ''}`}>
                    {value}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
            <span className={`text-sm text-muted font-medium shrink-0 ${aligned ? 'min-w-[120px]' : ''}`}>
                {label}
            </span>
            <span className={`text-sm font-semibold text-left break-words ${mono ? 'font-mono text-xs sm:text-sm' : ''} ${emphasize ? 'text-green-700 dark:text-green-500' : ''}`}>
                {value}
            </span>
        </div>
    );
}
