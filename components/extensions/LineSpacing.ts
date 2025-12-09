import { Extension } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';

export const LineSpacing = TextStyle.extend({
  name: 'lineSpacing',

  addAttributes() {
    return {
      ...this.parent?.(),
      lineHeight: {
        default: null,
        parseHTML: element => element.style.lineHeight || null,
        renderHTML: attributes => {
          if (!attributes.lineHeight) {
            return {};
          }
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }) => {
        return commands.setMark(this.name, { lineHeight });
      },
    };
  },
});

