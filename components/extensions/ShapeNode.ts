import { Node, mergeAttributes } from "@tiptap/core";

export const ShapeNode = Node.create({
  name: "shape",
  group: "block",
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: "rectangle",
        parseHTML: (element) =>
          element.getAttribute("data-type") || "rectangle",
        renderHTML: (attributes) => ({ "data-type": attributes.type }),
      },
      color: {
        default: "#4A90E2",
        parseHTML: (element) => element.getAttribute("data-color") || "#4A90E2",
        renderHTML: (attributes) => ({ "data-color": attributes.color }),
      },
      width: {
        default: 200,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-width")) || 200,
        renderHTML: (attributes) => ({ "data-width": attributes.width }),
      },
      height: {
        default: 120,
        parseHTML: (element) =>
          parseInt(element.getAttribute("data-height")) || 120,
        renderHTML: (attributes) => ({ "data-height": attributes.height }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { type, color, width = 200, height = 120 } = HTMLAttributes;

    // --- Shapes library ---
    const shapes: Record<
      string,
      (width: number, height: number, color: string) => string
    > = {
      rectangle: (w, h, c) =>
        `<rect x="10" y="10" width="${w - 20}" height="${
          h - 20
        }" rx="6" fill="${c}" />`,
      roundedRectangle: (w, h, c) =>
        `<rect x="10" y="10" width="${w - 20}" height="${
          h - 20
        }" rx="20" fill="${c}" />`,
      circle: (w, h, c) =>
        `<circle cx="${w / 2}" cy="${h / 2}" r="${
          Math.min(w, h) / 2 - 10
        }" fill="${c}" />`,
      triangle: (w, h, c) =>
        `<polygon points="${w / 2},10 ${w - 10},${h - 10} 10,${
          h - 10
        }" fill="${c}" />`,
      rightTriangle: (w, h, c) =>
        `<polygon points="10,10 ${w - 10},${h - 10} 10,${
          h - 10
        }" fill="${c}" />`,
      diamond: (w, h, c) =>
        `<polygon points="${w / 2},10 ${w - 10},${h / 2} ${w / 2},${
          h - 10
        } 10,${h / 2}" fill="${c}" />`,
      parallelogram: (w, h, c) =>
        `<polygon points="20,10 ${w - 10},10 ${w - 20},${h - 10} 10,${
          h - 10
        }" fill="${c}" />`,
      trapezoid: (w, h, c) =>
        `<polygon points="20,10 ${w - 20},10 ${w - 10},${h - 10} 10,${
          h - 10
        }" fill="${c}" />`,
      hexagon: (w, h, c) =>
        `<polygon points="${w / 2},10 ${w - 20},${h * 0.25} ${w - 20},${
          h * 0.75
        } ${w / 2},${h - 10} 20,${h * 0.75} 20,${h * 0.25}" fill="${c}" />`,
      octagon: (w, h, c) =>
        `<polygon points="${w * 0.3},10 ${w * 0.7},10 ${w - 10},${h * 0.3} ${
          w - 10
        },${h * 0.7} ${w * 0.7},${h - 10} ${w * 0.3},${h - 10} 10,${
          h * 0.7
        } 10,${h * 0.3}" fill="${c}" />`,
      star: (w, h, c) =>
        `<polygon points="${w / 2},10 ${w * 0.6},${h * 0.35} ${w - 10},${
          h * 0.35
        } ${w * 0.7},${h * 0.55} ${w * 0.8},${h - 10} ${w / 2},${h * 0.65} ${
          w * 0.2
        },${h - 10} ${w * 0.3},${h * 0.55} 10,${h * 0.35} ${w * 0.4},${
          h * 0.35
        }" fill="${c}" />`,
      heart: (w, h, c) =>
        `<path d="M ${w / 2},${h * 0.8} C ${w * 0.1},${h * 0.5} ${w * 0.4},10 ${
          w / 2
        },${h * 0.3} C ${w * 0.6},10 ${w * 0.9},${h * 0.5} ${w / 2},${
          h * 0.8
        } Z" fill="${c}" />`,
      rightArrow: (w, h, c) =>
        `<polygon points="10,${h / 4} ${w - 30},${h / 4} ${w - 30},10 ${
          w - 10
        },${h / 2} ${w - 30},${h - 10} ${w - 30},${(h * 3) / 4} 10,${
          (h * 3) / 4
        }" fill="${c}" />`,
      leftArrow: (w, h, c) =>
        `<polygon points="${w - 10},${h / 4} 30,${h / 4} 30,10 10,${h / 2} 30,${
          h - 10
        } 30,${(h * 3) / 4} ${w - 10},${(h * 3) / 4}" fill="${c}" />`,
      upArrow: (w, h, c) =>
        `<polygon points="10,${h - 10} ${w / 2},10 ${w - 10},${
          h - 10
        }" fill="${c}" />`,
      downArrow: (w, h, c) =>
        `<polygon points="10,10 ${w / 2},${h - 10} ${
          w - 10
        },10" fill="${c}" />`,
      cloud: (w, h, c) =>
        `<path d="M ${w * 0.2},${h * 0.5} C ${w * 0.1},${h * 0.4} ${w * 0.3},${
          h * 0.2
        } ${w * 0.5},${h * 0.3} C ${w * 0.6},${h * 0.1} ${w * 0.9},${h * 0.2} ${
          w * 0.8
        },${h * 0.5} Z" fill="${c}" />`,
    };

    // --- Helper function ---
    function drawShape(
      shapeName: string,
      width: number,
      height: number,
      color: string
    ): string {
      const shapeFn = shapes[shapeName];
      if (!shapeFn) {
        throw new Error(`Shape "${shapeName}" not found.`);
      }
      return shapeFn(width, height, color);
    }

    // --- Usage Example ---
    const svgContent = drawShape("star", 200, 200, "#FF5733");
    const svgElement = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    console.log(svgElement);
    const shapeFn = shapes[type] || shapes.rectangle;
    const shapeSVG = shapeFn(width, height, color); // Call the function

    return [
      "div",
      mergeAttributes(
        { class: "shape-node select-none cursor-move inline-block relative" },
        HTMLAttributes
      ),
      [
        "svg",
        {
          width,
          height,
          viewBox: `0 0 ${width} ${height}`,
          class: "shape-svg",
        },
        shapeSVG, // now a proper string
      ],
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      let { type, color, width = 200, height = 120 } = node.attrs;

      dom.className =
        "shape-node select-none cursor-move inline-block relative";
      dom.setAttribute("data-type", type);
      dom.setAttribute("data-color", color);
      dom.setAttribute("data-width", width.toString());
      dom.setAttribute("data-height", height.toString());

      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.classList.add("shape-svg");
      dom.appendChild(svg);

      // Shape definitions
      const shapes: Record<string, string> = {
        rectangle: `<rect x="10" y="10" width="${width - 20}" height="${
          height - 20
        }" rx="6" fill="${color}" />`,
        roundedRectangle: `<rect x="10" y="10" width="${width - 20}" height="${
          height - 20
        }" rx="20" fill="${color}" />`,
        circle: `<circle cx="${width / 2}" cy="${height / 2}" r="${
          Math.min(width, height) / 2 - 10
        }" fill="${color}" />`,
        triangle: `<polygon points="${width / 2},10 ${width - 10},${
          height - 10
        } 10,${height - 10}" fill="${color}" />`,
        diamond: `<polygon points="${width / 2},10 ${width - 10},${
          height / 2
        } ${width / 2},${height - 10} 10,${height / 2}" fill="${color}" />`,
        hexagon: `<polygon points="${width / 2},10 ${width - 20},${
          height * 0.25
        } ${width - 20},${height * 0.75} ${width / 2},${height - 10} 20,${
          height * 0.75
        } 20,${height * 0.25}" fill="${color}" />`,
        star: `<polygon points="${width / 2},10 ${width * 0.6},${
          height * 0.35
        } ${width - 10},${height * 0.35} ${width * 0.7},${height * 0.55} ${
          width * 0.8
        },${height - 10} ${width / 2},${height * 0.65} ${width * 0.2},${
          height - 10
        } ${width * 0.3},${height * 0.55} 10,${height * 0.35} ${width * 0.4},${
          height * 0.35
        }" fill="${color}" />`,
      };

      svg.innerHTML = shapes[type] || shapes.rectangle;

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type !== node.type) return false;

          const {
            type: newType,
            width: newWidth,
            height: newHeight,
            color: newColor,
          } = updatedNode.attrs;

          if (
            newType !== type ||
            newWidth !== width ||
            newHeight !== height ||
            newColor !== color
          ) {
            type = newType;
            width = newWidth;
            height = newHeight;
            color = newColor;

            dom.setAttribute("data-type", type);
            dom.setAttribute("data-color", color);
            dom.setAttribute("data-width", width.toString());
            dom.setAttribute("data-height", height.toString());

            svg.setAttribute("width", width.toString());
            svg.setAttribute("height", height.toString());
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

            svg.innerHTML = shapes[type] || shapes.rectangle;
          }

          return true;
        },
        destroy() {},
      };
    };
  },

  addCommands() {
    return {
      insertShape:
        (attrs: Record<string, any> = {}) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});

export default ShapeNode;
