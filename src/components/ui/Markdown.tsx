import type { Component } from 'solid-js';
import { createResource } from 'solid-js';
import * as marked from 'marked';
import createDOMPurify from 'dompurify';
import { createLogger } from '../../utils/logger';

const markdownLogger = createLogger('Markdown');

interface Props {
  content: string;
  class?: string;
}

const Markdown: Component<Props> = (props) => {
  markdownLogger.debug(`Rendering markdown with length: ${props.content.length}`);

  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert line breaks to <br>
  });

  const [html] = createResource(
    () => props.content,
    async (content) => {
      markdownLogger.debug('Processing markdown content');
      
      // Remove HTML comments
      const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
      
      // Parse markdown and sanitize the output
      const parsedHtml = await marked.parse(cleanContent);
      const sanitizedHtml = createDOMPurify.sanitize(parsedHtml);
      
      markdownLogger.info(`Markdown processed: ${sanitizedHtml.length} characters`);
      
      return sanitizedHtml;
    }
  );

  return (
    <div
      class={`prose prose-sm dark:prose-invert prose-a:text-accent hover:prose-a:text-accent-hover prose-blockquote:border-border prose-blockquote:bg-surface-secondary prose-blockquote:italic prose-code:rounded prose-code:bg-surface-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-pre:rounded-lg prose-pre:bg-surface-tertiary prose-ul:my-1 prose-li:my-0 prose-img:my-2 prose-img:rounded-lg prose-hr:border-border ${props.class || ''} `}
      innerHTML={html() || ''}
    />
  );
};

export default Markdown;
