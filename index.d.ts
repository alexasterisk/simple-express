import "express";

export class Server {
    constructor(ssl_cert?: string)
    public use(middleware: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => any): void;
    public start(port?: number): void;
}

export class Port {
    public static HTTP: number;
    public static HTTPS: number;
    public static Local: number;
    public static Ports: Map<number, string>;
    public static use(port: number): string;
}