export interface ChatNode {
    id: string;
    label: string;
    pattern: string;
    output: string[];
    invalidOutput?: string[];
    childs: ChatNode[];
    delayChildren?: number; // Delay antes de selecionar o próximo estado. CasoUso: O bot pede para o cliente digitar algo. Só que o cliente enviar em varias mensagens. Para exibir que o bot responda na primeira mensagem esperar algum tempo
    action?: {
        type: ChatNodeAction;
    }
    delay?: number; // seconds
}

interface Output {
    type: 'text' | 'local-file',
    contentType: string;
    content: string;
}

export enum ChatNodeAction {
    GoToPrevious = 1
}

export interface ChatBotProcessInput {
    input: string;
}

export interface ChatbotProcessResult {
    changed: boolean;
}

export class ChatBotStateMachine {
    private _rootNode: ChatNode;
    private _currentNodePath: string[];

    constructor(rootNode: ChatNode, currentNodeId: string | null) {
        this._rootNode = rootNode;
        this._currentNodePath = currentNodeId ? [currentNodeId] : [];
    }

    public next({ input }: ChatBotProcessInput): ChatbotProcessResult {

        const node = this.getCurrentNode();
        console.log('CurrentNodeId: ' + node?.id);

        if (node === null) {
            if (!new RegExp(this._rootNode.pattern, 'i').test(input)) {
                return {
                    changed: false
                };
            }

            this._currentNodePath = [this._rootNode.id];

            return {
                changed: true
            };
        }

        if (node.action) {

            if (node.action.type === ChatNodeAction.GoToPrevious) {
                this._currentNodePath.pop();
                return this.next({ input });
            }
        }

        const isLeafNode = node.childs.length === 0;
        if (isLeafNode) {
            this._currentNodePath = [];
            return {
                changed: true
            };
        }

        for (const child of node.childs) {
            const isMatch = new RegExp(child.pattern, 'i').test(input);
            if (!isMatch) continue;

            this._currentNodePath.push(child.id);
            return {
                changed: true
            };
        }

        return {
            changed: false
        };
    }

    public previus() {
        const node = this._currentNodePath.pop();
        return node !== undefined;
    }

    public currentState() {
        return this.getCurrentNode();
    }

    public isEnded() {
        const node = this.getCurrentNode();
        if (!node) return false;

        const isLeafNode = node.childs.length === 0;
        const hasActionGoTo = node.action && node.action.type === ChatNodeAction.GoToPrevious;
        return isLeafNode && !hasActionGoTo;
    }

    public reset() {
        this._currentNodePath = [];
    }

    private getCurrentNode() {
        if (this._currentNodePath.length === 0) return null;

        let node = this._rootNode;

        for (const nodeId of this._currentNodePath) {
            if (nodeId === this._rootNode.id) continue;

            const child = node.childs.find((x) => x.id == nodeId);
            if (!child) throw new Error('Node not found');

            node = child;
        }

        return node;
    }
}

export function injectExitNode(node: ChatNode, pattern: string, output: string) {
    const exitNode: ChatNode = {
        id: 'default-exit-node',
        label: 'Exit',
        pattern,
        output: [output],
        childs: [],
    };

    const inject = (node: ChatNode, pattern: string, output: string) => {
        if (node.childs.length === 0) return;

        for (const child of node.childs) {
            inject(child, pattern, output);
        }

        node.childs.unshift(exitNode);
    };

    inject(node, pattern, output);
}