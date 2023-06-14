"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// const input = fs.readFileSync("/dev/stdin", "utf8");
// const num: number = +input;
var code = fs.readFileSync('code.bf', 'utf8');
var input = fs.readFileSync('input.txt', 'utf8');
console.log(encode(code, input));
function encode(code, input) {
    var code_ptr = 0;
    var memory_ptr = 0;
    var input_ptr = 0;
    var memory = new Uint8Array(65536);
    var loop_stack = new Array();
    var res = '';
    while (code_ptr < code.length) {
        var cmd = code[code_ptr];
        switch (cmd) {
            case '+':
                memory[memory_ptr]++;
                break;
            case '-':
                memory[memory_ptr]--;
                break;
            case '>':
                memory_ptr++;
                if (memory.length <= memory_ptr)
                    throw new Error("範囲外アクセス");
                break;
            case '<':
                memory_ptr--;
                if (memory_ptr < 0)
                    throw new Error("範囲外アクセス");
                break;
            case '.':
                res += String.fromCharCode(memory[memory_ptr]);
                break;
            case ',':
                // if (input_ptr >= input.length) throw new Error('Input is too short');
                memory[memory_ptr] = input.charCodeAt(input_ptr);
                input_ptr++;
                break;
            case '[':
                if (memory[memory_ptr] == 0) {
                    var cnt = 0;
                    while (cnt != 1 || code[code_ptr] != ']') {
                        if (code[code_ptr] == '[')
                            cnt++;
                        if (code[code_ptr] == ']')
                            cnt--;
                        code_ptr++;
                    }
                }
                else {
                    loop_stack.push(code_ptr);
                }
                break;
            case ']':
                if (loop_stack.length == 0)
                    throw new Error('Loop syntax Error');
                if (memory[memory_ptr] == 0) {
                    loop_stack.pop();
                }
                else {
                    code_ptr = loop_stack[loop_stack.length - 1];
                }
                break;
            default:
                break;
        }
        code_ptr++;
    }
    if (loop_stack.length != 0)
        throw new Error('Loop syntax error');
    return res;
}
