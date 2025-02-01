import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className = "" }: CodeBlockProps) {
  return (
    <Highlight
      theme={themes.nightOwl}
      code={code.trim()}
      language={language as any}
    >
      {({
        className: preClassName,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <pre
          className={`${preClassName} ${className} overflow-x-auto whitespace-pre font-mono text-sm p-4 rounded-lg border scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/30 dark:scrollbar-thumb-purple-400/20 dark:hover:scrollbar-thumb-purple-400/30`}
          style={{
            ...style,
            backgroundColor: "var(--code-bg)",
          }}
        >
          <code className="block text-sm whitespace-pre">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
