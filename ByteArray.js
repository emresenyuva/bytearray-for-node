/*
Author: Emre Senyuva
Description: AS3 ByteArray for Node.js
*/

class bytestream {
    constructor(buff) {
        this.count = 0;
        this.buf = [];
        this.realArray = [];
    		if (buff) {
            if (buff instanceof Buffer) {
                let arraybuf = [];
                for (let c = 0; c < buff.length; c++) {
                    arraybuf.push(buff[c]);
                }
                this.buf = arraybuf;
                this.count = arraybuf.length;
            } else {
                this.buf = buff;
                this.count = buff.length;
            }
            this.realArray = this.buff
    		}
    }

    write(bytes) {
      	if (isNaN(bytes)){
      		for (let b = 0; b < bytes.length; b++) {
  	    		this.buf.push(bytes[b]);
  	    	}
  	    	this.count += bytes.length;
      	} else {
      		this.buf.push(bytes);
      		this.count++;
      	}
    }

    writeBoolean(value) {
      	this.write(value ? 1 : 0);
      	return this;
    }

    writeByte(number) {
        if (-128 <= number <= 127) {
            this.write(number);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeUnsignedByte(number) {
        if (0 <= number <= 255) {
            this.write(number);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeShort(number) {
        if (-32768 <= number <= 32767) {
            this.write((number >>> 8) & 0xFF);
          	this.write(number & 0xFF);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeUnsignedShort(number) {
        if (0 <= number <= 65535) {
            this.write((number >>> 8) & 0xFF);
          	this.write(number & 0xFF);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeInt(number) {
        if (-2147483648 <= number <= 2147483647) {
            this.write((number >>> 24) & 0xFF);
            this.write((number >>> 16) & 0xFF);
            this.write((number >>> 8) & 0xFF);
            this.write(number & 0xFF);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeUnsignedInt(number) {
        if (0 <= number <= 4294967295) {
            this.write((number >>> 24) & 0xFF);
            this.write((number >>> 16) & 0xFF);
            this.write((number >>> 8) & 0xFF);
            this.write(number & 0xFF);
        } else {
            throw new UserException('Number: %i too large to convert', number);
        }
      	return this;
    }

    writeBytes(value) {
      	this.write(value);
      	return this;
    }

    writeUTFBytes(value) {
        let strlen = value.length,
      		  bytesCount = 0,
          	bytes = [];
        for (let i = 0; i < strlen; i++) {
            let c = value.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                bytes[bytesCount++] = c;
            } else if (c > 0x07FF) {
                bytes[bytesCount++] = (0xE0 | ((c >> 12) & 0x0F));
                bytes[bytesCount++] = (0x80 | ((c >> 6) & 0x3F));
                bytes[bytesCount++] = (0x80 | (c & 0x3F));
            } else {
                bytes[bytesCount++] = (0xC0 | ((c >> 6) & 0x1F));
                bytes[bytesCount++] = (0x80 | (c & 0x3F));
            }
        }
        this.write(bytes);
      	return this;
    }

    writeUTF(value) {
        let strlen = value.length,
      		  bytesCount = 0,
          	bytes = [];
        for (let i = 0; i < strlen; i++) {
            let c = value.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                bytes[bytesCount++] = c;
            } else if (c > 0x07FF) {
                bytes[bytesCount++] = (0xE0 | ((c >> 12) & 0x0F));
                bytes[bytesCount++] = (0x80 | ((c >> 6) & 0x3F));
                bytes[bytesCount++] = (0x80 | (c & 0x3F));
            } else {
                bytes[bytesCount++] = (0xC0 | ((c >> 6) & 0x1F));
                bytes[bytesCount++] = (0x80 | (c & 0x3F));
            }
        }
        this.writeShort(bytes.length);
        this.write(bytes);
      	return this;
    }

    readUTF() {
        let size = this.readUnsignedShort();
        let bytearr = this.buf.slice(0, size);
        let value = '';
        for (let i = 0; i < size; ) {
            let c = bytearr[i] & 0xff;
            let x = c >> 4;
            if (x == 12 || x == 13) {
                i += 2;
                value += String.fromCharCode(((c & 0x1F) << 6) | (bytearr[i - 1] & 0x3F));
            } else if (x == 14) {
                i += 3;
                value += String.fromCharCode(((c & 0x0F) << 12) | ((bytearr[i - 2] & 0x3F) << 6) | ((bytearr[i - 1] & 0x3F)));
            } else {
                i++;
                value += String.fromCharCode(c);
            }
        }
        this.skipBytes(size)
        return value;
    }

    readUTFBytes(size) {
        let bytearr = this.buf.slice(0, size);
        let value = '';
        for (let i = 0; i < size; ) {
            let c = bytearr[i] & 0xff;
            let x = c >> 4;
            if (x == 12 || x == 13) {
                i += 2;
                value += String.fromCharCode((c & 0x1F) << 6) | (bytearr[i - 1] & 0x3F);
            } else if (x == 14) {
                i += 3;
                value += String.fromCharCode((c & 0x0F) << 12) | ((bytearr[i - 2] & 0x3F) << 6) | ((bytearr[i - 1] & 0x3F));
            } else {
                i++;
                value += String.fromCharCode(c);
            }
        }
        this.skipBytes(size)
        return value;
    }

    readByte() {
        if (this.buf.length >= 1){
            let val = this.buf[0] & 0xff;
            this.buf.shift();
            return val;
        } else {
            throw new RangeError('Index out of bounds');
        }
    }

    readBoolean() {
        return this.readByte() > 0 ? true : false;
    }

    readUnsignedByte() {
        let number = this.readByte();
        let max = 256;
        if (number > 127){
            number = ~~(-1 * (max - number));
        }
  			return number;
    }

    readShort() {
			   return (this.readByte() << 8) | this.readByte();
    }

    readUnsignedShort() {
        let number = this.readShort();
        let max = 65536;
        if (number > 32767){
            number = ~~(-1 * (max - number));
        }
  			return number;
    }

    readInt() {
        return (this.readByte() << 24) | (this.readByte() << 16) | (this.readByte() << 8) | this.readByte();
    }

    writeUnsignedInt() {
        let number = this.readShort();
        let max = 4294967296;
        if (number > 2147483647){
            number = ~~(-1 * (max - number));
        }
    		return number;
    }

    readBytes(length) {
        let bytes = this.buf.slice(0, length);
        this.buf = this.buf.slice(length)
        return bytes;
    }

    toBuffer() {
			return new Buffer(this.buf);
    }

    skipBytes(index) {
        this.buf = this.buf.slice(index);
    }

    toString() {
        return new Buffer(this.buf).toString();
    }

    clear() {
        this.buf = [];
    }
    get buffer() {
        return this.buf;
    }
    clone(arg1, arg2) {
        if(arg1) {
            if(arg2) {
                return new ByteArray(this.buf.slice(arg1, arg2));
            } else {
                return new ByteArray(this.buf.slice(arg1));
            }
        } else {
            return new ByteArray(this.buf);
        }
    }

    size() {
        return this.buf.length;
    }

    avalible() {
        return this.buf.length > 0;
    }

};
module.exports = bytestream;
