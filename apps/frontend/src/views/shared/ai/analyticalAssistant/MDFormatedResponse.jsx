import useClipboard from "@/hooks/useClipboard";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as styles from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import MDLiWithActions from "./MDLiWithActions";

export default function MDFormatedResponse({ renderPlugins, children }) {
  function getPlugins() {
    return renderPlugins ? [remarkGfm] : [];
  }
  const { copyPlainTextToClipBoard } = useClipboard();
  return (
    <ReactMarkdown
      children={children}
      remarkPlugins={[...getPlugins()]}
      components={{
        li: MDLiWithActions,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match)
            return (
              <React.Fragment>
                <div className="position-relative">
                  <Button
                    size="sm"
                    className="chat-copy-code-block-button border-0"
                    outline
                    onClick={() => copyPlainTextToClipBoard(children)}
                  >
                    copy
                  </Button>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={styles.vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                </div>
              </React.Fragment>
            );
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
}
