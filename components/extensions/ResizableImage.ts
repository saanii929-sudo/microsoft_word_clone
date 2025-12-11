import { Node, mergeAttributes } from '@tiptap/core';

export interface ResizableImageOptions {
  HTMLAttributes: Record<string, any>;
  inline: boolean;
  allowBase64: boolean;
  defaultWidth: number;
  defaultHeight: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      /**
       * Insert a resizable image
       */
      setResizableImage: (options: { src: string; width?: number; height?: number; alt?: string }) => ReturnType;
      /**
       * Update image dimensions
       */
      updateImageSize: (options: { width?: number; height?: number }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: 'resizableImage',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: this.options.defaultWidth,
        parseHTML: element => {
          const width = element.getAttribute('width') || element.getAttribute('data-width') || element.style.width;
          if (width) {
            const numWidth = parseInt(width.toString().replace('px', ''), 10);
            return numWidth || this.options.defaultWidth;
          }
          return this.options.defaultWidth;
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
            'data-width': attributes.width,
            style: `width: ${attributes.width}px;`,
          };
        },
      },
      height: {
        default: this.options.defaultHeight,
        parseHTML: element => {
          const height = element.getAttribute('height') || element.getAttribute('data-height') || element.style.height;
          if (height) {
            const numHeight = parseInt(height.toString().replace('px', ''), 10);
            return numHeight || this.options.defaultHeight;
          }
          return this.options.defaultHeight;
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
            'data-height': attributes.height,
            style: `height: ${attributes.height}px;`,
          };
        },
      },
      alt: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
        getAttrs: element => {
          if (typeof element === 'string') return false;
          const img = element as HTMLImageElement;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            width: img.getAttribute('width') || img.getAttribute('data-width') || img.style.width,
            height: img.getAttribute('height') || img.getAttribute('data-height') || img.style.height,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || this.options.defaultWidth;
    const height = HTMLAttributes.height || this.options.defaultHeight;
    
    return [
      'div',
      {
        class: 'resizable-image-wrapper',
        'data-width': width,
        'data-height': height,
        style: `position: relative; display: inline-block; width: ${width}px; height: ${height}px; max-width: 100%;`,
      },
      [
        'img',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          style: `width: ${width}px; height: ${height}px; max-width: 100%; object-fit: contain; cursor: pointer;`,
          'data-resizable': 'true',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setResizableImage:
        (options: { src: string; width?: number; height?: number; alt?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              width: options.width || this.options.defaultWidth,
              height: options.height || this.options.defaultHeight,
              alt: options.alt || '',
            },
          });
        },
      updateImageSize:
        (options: { width?: number; height?: number }) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from } = selection;
          
          const node = state.doc.nodeAt(from);
          if (node && node.type.name === this.name) {
            if (dispatch) {
              const attrs = {
                ...node.attrs,
                ...(options.width !== undefined && { width: options.width }),
                ...(options.height !== undefined && { height: options.height }),
              };
              tr.setNodeMarkup(from, undefined, attrs);
            }
            return true;
          }
          return false;
        },
    };
  },
}).configure({
  inline: false,
  allowBase64: true,
  defaultWidth: 500,
  defaultHeight: 300,
  HTMLAttributes: {
    class: 'resizable-image',
  },
});
