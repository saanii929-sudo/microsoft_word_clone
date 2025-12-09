import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ChartComponent from './ChartComponent';

export default Node.create({
    name: 'chart',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            type: {
                default: 'bar',
            },
            data: {
                default: [],
            },
            title: {
                default: 'My Chart',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="chart"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'chart' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChartComponent);
    },
});
