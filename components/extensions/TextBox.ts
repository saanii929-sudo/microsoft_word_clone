import { Node } from '@tiptap/core';

export interface TextBoxOptions {
  HTMLAttributes: Record<string, any>;
}

export const TextBox = Node.create<TextBoxOptions>({
  name: 'textBox',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'inline*',

  draggable: true,

  addAttributes() {
    return {
      width: {
        default: 300,
        parseHTML: element => parseInt(element.getAttribute('data-width') || '300'),
        renderHTML: attributes => ({
          'data-width': attributes.width,
          style: `width: ${attributes.width}px`,
        }),
      },
      height: {
        default: 100,
        parseHTML: element => parseInt(element.getAttribute('data-height') || '100'),
        renderHTML: attributes => ({
          'data-height': attributes.height,
          style: `height: ${attributes.height}px`,
        }),
      },
      backgroundColor: {
        default: '#ffffff',
        parseHTML: element => element.getAttribute('data-bg-color') || '#ffffff',
        renderHTML: attributes => ({
          'data-bg-color': attributes.backgroundColor,
          style: `background-color: ${attributes.backgroundColor}`,
        }),
      },
      borderColor: {
        default: '#000000',
        parseHTML: element => element.getAttribute('data-border-color') || '#000000',
        renderHTML: attributes => ({
          'data-border-color': attributes.borderColor,
          style: `border: 2px solid ${attributes.borderColor}`,
        }),
      },
      borderWidth: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-border-width') || '2'),
        renderHTML: attributes => ({
          'data-border-width': attributes.borderWidth,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-text-box]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const width = node.attrs.width || 300;
    const height = node.attrs.height || 100;
    const bgColor = node.attrs.backgroundColor || '#ffffff';
    const borderColor = node.attrs.borderColor || '#000000';
    const borderWidth = node.attrs.borderWidth || 2;

    return [
      'div',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-text-box': 'true',
        style: `width: ${width}px; min-height: ${height}px; background-color: ${bgColor}; border: ${borderWidth}px solid ${borderColor}; padding: 10px; margin: 10px; display: inline-block; vertical-align: top; cursor: move;`,
        contenteditable: 'true',
      },
      0,
    ];
  },

  addCommands() {
    return {
      setTextBox: (options?: { width?: number; height?: number; backgroundColor?: string; borderColor?: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            width: options?.width || 300,
            height: options?.height || 100,
            backgroundColor: options?.backgroundColor || '#ffffff',
            borderColor: options?.borderColor || '#000000',
          },
        });
      },
    };
  },
});

