import { Extension } from '@tiptap/core';

export const DropCap = Extension.create({
  name: 'dropCap',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          dropCap: {
            default: false,
            parseHTML: element => element.classList.contains('drop-cap'),
            renderHTML: attributes => {
              if (!attributes.dropCap) {
                return {};
              }
              return {
                class: 'drop-cap',
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setDropCap: () => ({ commands, state }) => {
        const { selection } = state;
        const { $from } = selection;
        const paragraph = $from.parent;

        if (paragraph.type.name === 'paragraph') {
          return commands.updateAttributes('paragraph', {
            dropCap: true,
          });
        }

        return false;
      },
      removeDropCap: () => ({ commands }) => {
        return commands.updateAttributes('paragraph', {
          dropCap: false,
        });
      },
    };
  },
});

