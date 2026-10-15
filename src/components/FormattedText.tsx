import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Parses markdown-style bold (**text**), italics (*text*), inline code (`code`),
 * prefix labels (e.g. "Largest-first:"), and CIDR/network notation into styled elements.
 */
function parseTokens(str: string): React.ReactNode[] {
  // Regex matches:
  // 1. **bold** or __bold__
  // 2. `code`
  // 3. *italic* or _italic_
  // 4. IP/CIDR like /24, /25, 192.168.1.1/24
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_|\/(?:[0-9]{1,2})\b|(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?)/g;

  const parts = str.split(regex);
  return parts.map((part, i) => {
    if (!part) return null;

    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const content = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {content}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <code
          key={i}
          className="mx-0.5 px-1.5 py-0.5 rounded font-mono text-[12px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
        >
          {content}
        </code>
      );
    }

    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      const content = part.slice(1, -1);
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {content}
        </em>
      );
    }

    // Network CIDR prefix or IP format (e.g. /25, /26, 192.168.50.0/24)
    if (/^\/(?:[0-9]{1,2})$/.test(part) || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/.test(part)) {
      return (
        <span
          key={i}
          className="font-mono font-semibold text-slate-900 dark:text-slate-100 tracking-tight"
        >
          {part}
        </span>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split lines by newline to preserve formatting
  const lines = text.split('\n');

  return (
    <span className={`inline-block leading-relaxed ${className}`}>
      {lines.map((line, lineIdx) => {
        // Detect leading prefix like "Largest-first:" or "Smallest-first:" or "Option 1:"
        const prefixMatch = line.match(/^([A-Za-z0-9\-_/ ]{1,32}:)\s*(.*)$/);

        let content: React.ReactNode;
        if (prefixMatch && !line.startsWith('**') && !line.startsWith('http')) {
          const prefix = prefixMatch[1];
          const rest = prefixMatch[2];
          content = (
            <>
              <strong className="font-bold text-slate-900 dark:text-white mr-1.5">
                {prefix}
              </strong>
              {parseTokens(rest)}
            </>
          );
        } else {
          content = parseTokens(line);
        }

        return (
          <React.Fragment key={lineIdx}>
            {content}
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};
