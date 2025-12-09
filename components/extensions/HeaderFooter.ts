import { Extension } from '@tiptap/core';

export const HeaderFooter = Extension.create({
  name: 'headerFooter',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          isHeader: {
            default: false,
            parseHTML: element => element.classList.contains('header-content'),
            renderHTML: attributes => {
              if (!attributes.isHeader) {
                return {};
              }
              return {
                class: 'header-content',
              };
            },
          },
          isFooter: {
            default: false,
            parseHTML: element => element.classList.contains('footer-content'),
            renderHTML: attributes => {
              if (!attributes.isFooter) {
                return {};
              }
              return {
                class: 'footer-content',
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      insertHeader: () => ({ commands }) => {
        return commands.insertContent('<div class="document-header" style="position: fixed; top: 0; left: 0; right: 0; padding: 20px; background: white; border-bottom: 1px solid #e0e0e0; z-index: 1000;">Header Content</div>');
      },
      insertFooter: () => ({ commands }) => {
        return commands.insertContent('<div class="document-footer" style="position: fixed; bottom: 0; left: 0; right: 0; padding: 20px; background: white; border-top: 1px solid #e0e0e0; z-index: 1000;">Footer Content</div>');
      },
    };
  },
});

