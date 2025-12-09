import { Node } from '@tiptap/core';

export interface ShapeOptions {
  HTMLAttributes: Record<string, any>;
}

export const Shape = Node.create<ShapeOptions>({
  name: 'shape',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'rect',
        parseHTML: element => element.getAttribute('data-shape-type'),
        renderHTML: attributes => {
          if (!attributes.type) {
            return {};
          }
          return {
            'data-shape-type': attributes.type,
          };
        },
      },
      width: {
        default: 200,
        parseHTML: element => parseInt(element.getAttribute('data-width') || '200'),
        renderHTML: attributes => {
          return {
            'data-width': attributes.width,
            style: `width: ${attributes.width}px`,
          };
        },
      },
      height: {
        default: 200,
        parseHTML: element => parseInt(element.getAttribute('data-height') || '200'),
        renderHTML: attributes => {
          return {
            'data-height': attributes.height,
            style: `height: ${attributes.height}px`,
          };
        },
      },
      fill: {
        default: '#3b82f6',
        parseHTML: element => element.getAttribute('data-fill') || '#3b82f6',
        renderHTML: attributes => {
          return {
            'data-fill': attributes.fill,
          };
        },
      },
      stroke: {
        default: '#1e40af',
        parseHTML: element => element.getAttribute('data-stroke') || '#1e40af',
        renderHTML: attributes => {
          return {
            'data-stroke': attributes.stroke,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-shape-type]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const type = node.attrs.type || 'rect';
    const width = node.attrs.width || 200;
    const height = node.attrs.height || 200;
    const fill = node.attrs.fill || '#3b82f6';
    const stroke = node.attrs.stroke || '#1e40af';

    let shapeStyle = '';

    switch (type) {
      case 'rect':
      case 'rectangle':
        shapeStyle = `width: ${width}px; height: ${height}px; background-color: ${fill}; border: 2px solid ${stroke}; border-radius: 4px;`;
        break;
      case 'circle':
        shapeStyle = `width: ${width}px; height: ${width}px; background-color: ${fill}; border: 2px solid ${stroke}; border-radius: 50%;`;
        break;
      case 'oval':
        shapeStyle = `width: ${width}px; height: ${height}px; background-color: ${fill}; border: 2px solid ${stroke}; border-radius: 50%;`;
        break;
      case 'triangle':
        shapeStyle = `width: 0; height: 0; border-left: ${width / 2}px solid transparent; border-right: ${width / 2}px solid transparent; border-bottom: ${height}px solid ${fill}; border-top: none;`;
        break;
      default:
        shapeStyle = `width: ${width}px; height: ${height}px; background-color: ${fill}; border: 2px solid ${stroke};`;
    }

    return [
      'div',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-shape-type': type,
        style: shapeStyle + ' display: inline-block; margin: 10px; cursor: move;',
        contenteditable: 'false',
      },
    ];
  },

  addCommands() {
    return {
      setShape: (options: { type: string; width?: number; height?: number; fill?: string; stroke?: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            type: options.type,
            width: options.width || 200,
            height: options.height || 200,
            fill: options.fill || '#3b82f6',
            stroke: options.stroke || '#1e40af',
          },
        });
      },
    };
  },
});

