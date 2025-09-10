import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');
//@ts-ignore
export class RadioBlockBlot extends BlockEmbed {
    static blotName = 'radioBlock';
    static tagName = 'div';
    static className = 'radio-block';

    static create(value: string) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.classList.add('radio-block');
        node.innerHTML = value;
        return node;
    }

    static value(node: HTMLElement) {
        return node.innerHTML;
    }
}