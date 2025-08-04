import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export class SelectOptionsBlot extends BlockEmbed {
    static blotName = 'selectOptions';
    static tagName = 'div';
    static className = 'select-options-block';

    static create(value: string) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.classList.add('select-options-block');
        node.innerHTML = value;
        return node;
    }

    static value(node: HTMLElement) {
        return node.innerHTML;
    }
}