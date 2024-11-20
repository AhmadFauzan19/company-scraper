export default interface Message<Body = any> {
    headers?: { [key: string]: string } | null
    body: Body
}
