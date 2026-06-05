import { marked } from 'marked';
import katex from 'katex';

export function renderMarkdown(content: string): string {
    // Custom renderer or extensions can be added here if needed

    // First, process LaTeX equations
    // We'll look for $$...$$ for block math and $...$ for inline math
    // Note: robust parsing might need a more complex regex or a tokenizer, 
    // but this is a starter implementation.

    let processedContent = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
        try {
            return katex.renderToString(equation, { displayMode: true });
        } catch (e) {
            console.error(e);
            return match;
        }
    });

    processedContent = processedContent.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
        try {
            return katex.renderToString(equation, { displayMode: false });
        } catch (e) {
            console.error(e);
            return match;
        }
    });

    // Then parse Markdown
    return marked.parse(processedContent) as string;
}
