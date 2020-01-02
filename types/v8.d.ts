declare module 'v8' {

    function serialize(object: any): Buffer;
    function deserialize(buffer: Buffer | Uint8Array): any;

}