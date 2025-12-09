import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
  width: number;
  height: number;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Insert a video
       */
      setVideo: (options: { src: string; width?: number; height?: number; controls?: boolean; autoplay?: boolean; loop?: boolean; muted?: boolean }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: 'video',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
      controls: {
        default: this.options.controls,
      },
      autoplay: {
        default: this.options.autoplay,
      },
      loop: {
        default: this.options.loop,
      },
      muted: {
        default: this.options.muted,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          return {
            src: element.getAttribute('src'),
            width: element.getAttribute('width') || this.options.width,
            height: element.getAttribute('height') || this.options.height,
            controls: element.hasAttribute('controls'),
            autoplay: element.hasAttribute('autoplay'),
            loop: element.hasAttribute('loop'),
            muted: element.hasAttribute('muted'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: HTMLAttributes.controls !== false,
        style: `width: ${HTMLAttributes.width || this.options.width}px; height: ${HTMLAttributes.height || this.options.height}px; max-width: 100%;`,
      }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options: { src: string; width?: number; height?: number; controls?: boolean; autoplay?: boolean; loop?: boolean; muted?: boolean }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
}).configure({
  width: 640,
  height: 360,
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  HTMLAttributes: {
    class: 'video-player',
  },
});

