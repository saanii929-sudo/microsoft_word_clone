import { Node } from '@tiptap/core';

export interface SignatureLineOptions {
  HTMLAttributes: Record<string, any>;
}

export const SignatureLine = Node.create<SignatureLineOptions>({
  name: 'signatureLine',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      signerName: {
        default: '',
        parseHTML: element => element.getAttribute('data-signer-name') || '',
        renderHTML: attributes => ({
          'data-signer-name': attributes.signerName,
        }),
      },
      signerTitle: {
        default: '',
        parseHTML: element => element.getAttribute('data-signer-title') || '',
        renderHTML: attributes => ({
          'data-signer-title': attributes.signerTitle,
        }),
      },
      showDate: {
        default: true,
        parseHTML: element => element.getAttribute('data-show-date') !== 'false',
        renderHTML: attributes => ({
          'data-show-date': attributes.showDate,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-signature-line]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const signerName = node.attrs.signerName || '________________';
    const signerTitle = node.attrs.signerTitle || '';
    const showDate = node.attrs.showDate !== false;

    return [
      'div',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-signature-line': 'true',
        style: 'margin: 40px 0; padding: 20px; border-top: 2px solid #000; min-height: 100px;',
      },
      [
        'div',
        { style: 'margin-bottom: 10px;' },
        [
          'div',
          { style: 'margin-bottom: 40px; min-height: 50px; border-bottom: 1px solid #ccc;' },
          'Signature',
        ],
        [
          'div',
          { style: 'margin-bottom: 5px; font-weight: bold;' },
          signerName,
        ],
        signerTitle && [
          'div',
          { style: 'margin-bottom: 5px; color: #666;' },
          signerTitle,
        ],
        showDate && [
          'div',
          { style: 'margin-top: 10px; color: #666;' },
          `Date: ${new Date().toLocaleDateString()}`,
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setSignatureLine: (options?: { signerName?: string; signerTitle?: string; showDate?: boolean }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            signerName: options?.signerName || '',
            signerTitle: options?.signerTitle || '',
            showDate: options?.showDate !== false,
          },
        });
      },
    };
  },
});

