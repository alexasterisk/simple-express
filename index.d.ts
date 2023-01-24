import "express";

export class Server {
    constructor(ssl_cert?: string)
    public use(middleware: (req: Express.Request, res: Express.Response, next: () => void) => any): void;
    public get(path: string, callback: (req: Express.Request, res: Express.Response) => void): void;
    public addFolder(path: string): string;
    public start(port?: number): void;
}

export class Port {
    public static HTTP: number;
    public static HTTPS: number;
    public static Local: number;
    public static Ports: Map<number, string>;
    public static use(port: number): string;
}