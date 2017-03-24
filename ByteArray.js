/*
Author: Emre Senyuva
Description: AS3 ByteArray for Node.js
*/

const struct = require("pystruct");
function ByteArray(bytes = ''){
    this.bytes = bytes;
}
module.exports = ByteArray;
ByteArray.prototype = {
    writeByte: function(value) {
        this.bytes += struct.pack('!b', value);
        return this;
    },

    writeUnsignedByte: function(value) {
        this.bytes += struct.pack('!B', value);
        return this;
    },

    writeShort: function(value) {
        this.bytes += struct.pack('!h', value);
        return this;
    },

    writeUnsignedShort: function(value) {
        this.bytes += struct.pack('!H', value);
        return this;
    },

    writeInt: function(value) {
        this.bytes += struct.pack('!i', value);
        return this;
    },

    writeUnsignedInt: function(value) {
        this.bytes += struct.pack('!I', value);
        return this;
    },

    writeBool: function(value) {
        this.bytes += struct.pack('!?', value ? 1 : 0);
        return this;
    },

    writeUTF: function(value) {
        size = value.length;
        this.writeShort(size);
        this.write(value)
        return this;
    },

    writeBytes: function(value) {
        this.bytes += value;
        return this;
    },

    write: function(value) {
        this.bytes += value;
    },

    readByte: function() {
        value = struct.unpack("!b", new Buffer(this.bytes.slice(0, 1)))[0];
        this.bytes = this.bytes.slice(1);
        return value;
    },

    readUnsignedByte: function() {
        value = struct.unpack("!B", new Buffer(this.bytes.slice(0, 1)))[0];
        this.bytes = this.bytes.slice(1);
        return value;
    },

    readShort: function() {
        value = struct.unpack("!h", new Buffer(this.bytes.slice(0, 2)))[0];
        this.bytes = this.bytes.slice(2);
        return value;
    },

    readUnsignedShort: function() {
        value = struct.unpack("!H", new Buffer(this.bytes.slice(0, 2)))[0];
        this.bytes = this.bytes.slice(2);
        return value;
    },

    readInt: function() {
        value = struct.unpack("!i", new Buffer(this.bytes.slice(0, 4)))[0];
        this.bytes = this.bytes.slice(4);
        return value;
    },

    readUnsignedInt: function() {
        value = struct.unpack("!I", new Buffer(this.bytes.slice(0, 4)))[0];
        this.bytes = this.bytes.slice(4);
        return value;
    },

    readUnsignedInt: function() {
        value = struct.unpack("!I", new Buffer(this.bytes.slice(0, 4)))[0];
        this.bytes = this.bytes.slice(4);
        return value;
    },

    readUTF: function() {
        size = struct.unpack("!h", new Buffer(this.bytes.slice(0, 2)))[0];
        value = this.bytes.slice(2, 2 + size);
        this.bytes = this.bytes.slice(size + 2);
        return value;
    },

    readUnsignedUTF: function() {
        size = struct.unpack("!H", new Buffer(this.bytes.slice(0, 2)))[0];
        value = this.bytes.slice(2, 2 + size);
        this.bytes = this.bytes.slice(size + 2);
        return value;
    },

    readBool: function() {
        value = struct.unpack("!?", new Buffer(this.bytes.slice(0, 1)))[0];
        this.bytes = this.bytes.slice(1);
        if (value == 1) {
            return true;
        } else {
            return false;
        }
    },
    toByteArray: function() {
        return this.bytes;
    },

    getLength: function() {
        return this.bytes.length;
    },

    bytesAvailable: function() {
        return this.bytes.length > 0;
    },

}