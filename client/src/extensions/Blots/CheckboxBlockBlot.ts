import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export class CheckboxBlockBlot extends BlockEmbed {
    static blotName = 'checkboxBlock';
    static tagName = 'div';
    static className = 'checkbox-block';

    static create(value: string) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.classList.add('checkbox-block');
        node.innerHTML = value;
        return node;
    }

    static value(node: HTMLElement) {
        return node.innerHTML;
    }
}