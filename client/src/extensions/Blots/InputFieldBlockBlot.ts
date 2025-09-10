import Quill from 'quill';
const BlockEmbed = Quill.import('blots/block/embed');
//@ts-ignore
export class InputFieldBlockBlot extends BlockEmbed {
    static blotName = 'inputFieldBlock';
    static tagName = 'div';
    static className = 'input-field-block';

    static create(data: { values: string[], example: boolean }) {
        const node = super.create() as HTMLElement;
        node.setAttribute('contenteditable', 'false');
        node.classList.add('input-field-block');

        const safeValues = Array.isArray(data?.values) ? data.values : [];
        const safeExample = !!data?.example;

        node.dataset.values = JSON.stringify(safeValues);
        node.dataset.example = String(safeExample);

        const joined = safeValues.join('/');

        const inputValue = !safeExample && joined ? joined : '';
        const placeholder = safeExample && joined ? joined : '';

        node.innerHTML = `<input type="text" value="${inputValue}" placeholder="${placeholder}" style="border:1px solid #ccc; padding:4px; border-radius:4px;"/>`;

        return node;
    }

    static value(node: HTMLElement) {
        return {
            values: JSON.parse(node.dataset.values || '[]'),
            example: node.dataset.example === 'true'
        };
    }
}