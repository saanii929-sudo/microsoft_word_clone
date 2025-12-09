import { Extension } from '@tiptap/core';
import { Node } from '@tiptap/core';

let footnoteCounter = 1;

export const Footnote = Node.create({
  name: 'footnote',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      number: {
        default: null,
      },
      content: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="footnote"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const number = HTMLAttributes.number || footnoteCounter++;
    return [
      'span',
      {
        'data-type': 'footnote',
        class: 'footnote-reference',
        style: 'vertical-align: super; font-size: 0.8em; color: blue; cursor: pointer;',
        ...HTMLAttributes,
      },
      `[${number}]`,
    ];
  },

  addCommands() {
    return {
      setFootnote: (attributes) => ({ commands }) => {
        const number = footnoteCounter++;
        return commands.insertContent({
          type: this.name,
          attrs: {
            id: attributes.id || `footnote-${number}`,
            number: number,
            content: attributes.content || '',
          },
        });
      },
    };
  },
});

