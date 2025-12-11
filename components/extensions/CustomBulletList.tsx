import BulletList from '@tiptap/extension-bullet-list';

export const CustomBulletList = BulletList.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            bulletStyle: {
                default: 'disc',
                parseHTML: element => element.getAttribute('data-bullet-style'),
                renderHTML: attributes => {
                    if (!attributes.bulletStyle) {
                        return {};
                    }
                    return {
                        'data-bullet-style': attributes.bulletStyle,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setBulletStyle: (style: string) => ({ commands }: any) => {
                return commands.updateAttributes(this.name, { bulletStyle: style });
            },
        };
    },
});

export default CustomBulletList;
