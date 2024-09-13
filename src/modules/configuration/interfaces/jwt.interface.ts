export interface JWTBaseConfiguration {
    saltRounds: number;
    expiresIn: string;
}

export interface JWTConfiguration extends JWTBaseConfiguration {
    secret: string;
}
