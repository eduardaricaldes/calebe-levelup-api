export interface TokenPayload {
  sub: string;
  email: string;
}

export default interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
