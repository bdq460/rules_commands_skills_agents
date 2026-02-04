// 上下文管理工具
export class ContextManager {
    private context: Record<string, any> = {};
    set(key: string, value: any) {
        this.context[key] = value;
    }
    get(key: string) {
        return this.context[key];
    }
}
