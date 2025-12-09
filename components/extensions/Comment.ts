import { Node, mergeAttributes } from '@tiptap/core';

export const Comment = Node.create({
  name: 'comment',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-comment-id': attributes.id,
          };
        },
      },
      author: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-author'),
        renderHTML: attributes => {
          if (!attributes.author) {
            return {};
          }
          return {
            'data-comment-author': attributes.author,
          };
        },
      },
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-comment-content') || '',
        renderHTML: attributes => {
          if (!attributes.content) {
            return {};
          }
          return {
            'data-comment-content': attributes.content,
            title: `${attributes.author || 'User'}: ${attributes.content}`,
          };
        },
      },
      date: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-date'),
        renderHTML: attributes => {
          if (!attributes.date) {
            return {};
          }
          return {
            'data-comment-date': attributes.date,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="comment"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          return {
            id: element.getAttribute('data-comment-id'),
            author: element.getAttribute('data-comment-author'),
            content: element.getAttribute('data-comment-content') || '',
            date: element.getAttribute('data-comment-date'),
          };
        },
      },
      {
        tag: 'comment',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const content = element.textContent || '';
          return {
            id: Date.now().toString(),
            author: 'User',
            content: content,
            date: new Date().toISOString(),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs;
    return [
      'span',
      mergeAttributes(
        {
          'data-type': 'comment',
          'data-comment-id': attrs.id,
          'data-comment-author': attrs.author || 'User',
          'data-comment-content': attrs.content || '',
          'data-comment-date': attrs.date || new Date().toISOString(),
          class: 'comment-marker',
          style: 'background-color: #ffeb3b; cursor: pointer; padding: 2px 6px; border-radius: 3px; display: inline-block; position: relative; margin: 0 2px;',
          title: `${attrs.author || 'User'}: ${attrs.content || 'Comment'}`,
        },
        HTMLAttributes
      ),
      '💬',
    ];
  },

  addCommands() {
    return {
      setComment: (attributes: { id?: string; author?: string; content: string; date?: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            id: attributes.id || Date.now().toString(),
            author: attributes.author || 'User',
            content: attributes.content || '',
            date: attributes.date || new Date().toISOString(),
          },
        });
      },
    };
  },
});

