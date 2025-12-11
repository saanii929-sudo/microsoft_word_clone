import OrderedList from '@tiptap/extension-ordered-list';

export const CustomOrderedList = OrderedList.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            numberingStyle: {
                default: 'decimal',
                parseHTML: element => element.getAttribute('data-numbering-style'),
                renderHTML: attributes => {
                    if (!attributes.numberingStyle) {
                        return {};
                    }
                    return {
                        'data-numbering-style': attributes.numberingStyle,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setNumberingStyle: (style: string) => ({ commands }: any) => {
                return commands.updateAttributes(this.name, { numberingStyle: style });
            },
        };
    },
});

export default CustomOrderedList;
