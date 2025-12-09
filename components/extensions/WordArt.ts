import { Node } from '@tiptap/core';

export interface WordArtOptions {
  HTMLAttributes: Record<string, any>;
}

export const WordArt = Node.create<WordArtOptions>({
  name: 'wordArt',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      text: {
        default: 'WordArt',
        parseHTML: element => element.textContent || 'WordArt',
        renderHTML: attributes => ({
          'data-text': attributes.text,
        }),
      },
      style: {
        default: 'gradient',
        parseHTML: element => element.getAttribute('data-style') || 'gradient',
        renderHTML: attributes => ({
          'data-style': attributes.style,
        }),
      },
      fontSize: {
        default: 48,
        parseHTML: element => parseInt(element.getAttribute('data-font-size') || '48'),
        renderHTML: attributes => ({
          'data-font-size': attributes.fontSize,
          style: `font-size: ${attributes.fontSize}px`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-word-art]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const text = node.attrs.text || 'WordArt';
    const style = node.attrs.style || 'gradient';
    const fontSize = node.attrs.fontSize || 48;

    let wordArtStyle = '';

    switch (style) {
      case 'gradient':
        wordArtStyle = `background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: ${fontSize}px; font-weight: bold;`;
        break;
      case 'shadow':
        wordArtStyle = `color: #333; text-shadow: 3px 3px 0px #999, 6px 6px 0px #666; font-size: ${fontSize}px; font-weight: bold;`;
        break;
      case 'outline':
        wordArtStyle = `color: transparent; -webkit-text-stroke: 2px #000; font-size: ${fontSize}px; font-weight: bold;`;
        break;
      case '3d':
        wordArtStyle = `color: #fff; text-shadow: 1px 1px 0px #999, 2px 2px 0px #888, 3px 3px 0px #777, 4px 4px 0px #666; font-size: ${fontSize}px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
        break;
      default:
        wordArtStyle = `font-size: ${fontSize}px; font-weight: bold; color: #333;`;
    }

    return [
      'span',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-word-art': 'true',
        style: wordArtStyle + ' display: inline-block; margin: 5px;',
        contenteditable: 'false',
      },
      text,
    ];
  },

  addCommands() {
    return {
      setWordArt: (options: { text: string; style?: string; fontSize?: number }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            text: options.text,
            style: options.style || 'gradient',
            fontSize: options.fontSize || 48,
          },
        });
      },
    };
  },
});

