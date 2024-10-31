import type { Component } from 'solid-js';
import { createResource } from 'solid-js';
import * as marked from 'marked';
import createDOMPurify from 'dompurify';

interface Props {
  content: string;
  class?: string;
}

const Markdown: Component<Props> = (props) => {
  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true // Convert line breaks to <br>
  });

  const [html] = createResource(() => props.content, async (content) => {
    // Remove HTML comments
    const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
    // Parse markdown and sanitize the output
    const parsedHtml = await marked.parse(cleanContent);
    return createDOMPurify.sanitize(parsedHtml);
  });

  return (
    <div 
      class={`
        prose prose-sm dark:prose-invert
        prose-a:text-accent hover:prose-a:text-accent-hover
        prose-pre:bg-surface-tertiary prose-pre:rounded-lg 
        prose-code:bg-surface-tertiary prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm 
        prose-img:rounded-lg prose-img:my-2
        prose-blockquote:italic prose-blockquote:border-border prose-blockquote:bg-surface-secondary
        prose-ul:my-1 prose-li:my-0
        prose-hr:border-border
        ${props.class || ''}
      `}
      innerHTML={html() || ''}
    />
  );
};

export default Markdown;
