import { Extension } from '@tiptap/core';

export const Indent = Extension.create({
  name: 'indent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: null,
            parseHTML: element => {
              const marginLeft = element.style.marginLeft;
              if (marginLeft) {
                const match = marginLeft.match(/(\d+)px/);
                return match ? parseInt(match[1]) : null;
              }
              return null;
            },
            renderHTML: attributes => {
              if (!attributes.indent) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch, commands }) => {
        const { selection } = state;
        const { $from } = selection;
        const node = $from.parent;

        if (dispatch && node) {
          const currentIndent = node.attrs.indent || 0;
          return commands.updateAttributes(node.type.name, {
            ...node.attrs,
            indent: currentIndent + 40,
          });
        }

        return true;
      },
      outdent: () => ({ tr, state, dispatch, commands }) => {
        const { selection } = state;
        const { $from } = selection;
        const node = $from.parent;

        if (dispatch && node) {
          const currentIndent = node.attrs.indent || 0;
          return commands.updateAttributes(node.type.name, {
            ...node.attrs,
            indent: Math.max(0, currentIndent - 40),
          });
        }

        return true;
      },
    };
  },
});

