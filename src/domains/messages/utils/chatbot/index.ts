export interface ChatNode {
    id: string;
    label: string;
    patternType: ChatNodePatternType;
    pattern: string;
    output: ChatNodeOutput[];
    invalidOutput?: ChatNodeOutput[];
    childs: ChatNode[];
    delayChildren?: number; // Delay antes de selecionar o próximo estado. CasoUso: O bot pede para o cliente digitar algo. Só que o cliente enviar em varias mensagens. Para exibir que o bot responda na primeira mensagem esperar algum tempo
    action?: {
        type: ChatNodeAction;
    }
    delay?: number; // seconds
}

export interface ChatNodeOutput {
    type: typeof ChatNodeOutputType[keyof typeof ChatNodeOutputType];
    contentType?: string;
    content: string;
}

export const ChatNodeOutputType = {
    text: 'text',
    mediaLink:  'media-link'
} as const;

export enum ChatNodeAction {
    GoToPrevious = 1
}

export enum ChatNodePatternType {
    StartsWith = 1,
    EndsWith = 2,
    Contains = 3,
    Exact = 4,
    Regex = 5
};

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

            if (!this.testPattern(this._rootNode.patternType, this._rootNode.pattern, input)) {
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
            const isMatch = this.testPattern(child.patternType, child.pattern, input);
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

    private testPattern(patternType: ChatNodePatternType, pattern: string, input: string) {

        if (patternType === ChatNodePatternType.Exact) {
            return input.toLowerCase() === pattern.toLowerCase();
        }

        if (patternType === ChatNodePatternType.StartsWith) {
            return input.toLowerCase().startsWith(pattern.toLowerCase());
        }

        if (patternType === ChatNodePatternType.EndsWith) {
            return input.toLowerCase().endsWith(pattern.toLowerCase());
        }

        if (patternType === ChatNodePatternType.Contains) {
            return input.toLowerCase().includes(pattern.toLowerCase());
        }

        return new RegExp(pattern, 'i').test(input);
    }
}

export function injectExitNode(node: ChatNode, patternType: ChatNodePatternType, pattern: string, output: string) {
    const exitNode: ChatNode = {
        id: 'default-exit-node',
        label: 'Exit',
        patternType,
        pattern,
        output: [{
            type: ChatNodeOutputType.text,
            content: output
        }],
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