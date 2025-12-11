import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ShapeComponent from './ShapeComponent';

export default Node.create({
    name: 'shape',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            type: {
                default: 'rectangle',
            },
            width: {
                default: 200,
            },
            height: {
                default: 150,
            },
            fillColor: {
                default: '#3b82f6',
            },
            borderColor: {
                default: '#1e40af',
            },
            borderWidth: {
                default: 2,
            },
            x: {
                default: 0,
            },
            y: {
                default: 0,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="shape"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'shape' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ShapeComponent);
    },
});
