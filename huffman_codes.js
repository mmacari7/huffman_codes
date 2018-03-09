//Anthony Rusignuolo, Michael Macari, Jon Lafleur
//Huffman Codes

var prompt = require('prompt-sync')();
var fs = require('fs');


class priorityQueue{
    constructor(){
        this.queue = [];
    };

    enqueue(node){
        var contain = false;

        // if(this.queue.length < 1){
        //     this.queue.push(node);
        // }
        //
        //
        // var l = 0;
        // var r = this.queue.length -1;
        // while(l <= r){
        //     var mid = Math.floor((l+r) / 2);
        //     if(node.frequency == this.queue[mid].frequency){
        //         return
        //     }
        //     if(node.frequency > this.queue[mid].frequency){
        //         l = mid + 1;
        //     }
        //     else{
        //         r = mid - 1;
        //     }
        // }
        // this.queue.splice(r, 0, node);


        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i].frequency > node.frequency) {
                this.queue.splice(i, 0, node);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.queue.push(node);
        }
    }
    dequeue(){
        if(this.queue.length == 0){
            return("Is empty");
        }
        else{
            return(this.queue.shift());
        }
    }
}

class huffman_node{
    constructor(frequency, id, symbol = null, left = null, right = null, parent = null){
        this.frequency = frequency;
        this.id = id;
        this.symbol = symbol;
        this.parent = parent;
        this.left = left;
        this.right = right;
    };

    parentUpdate(parent){
        this.parent = parent;
    }
}

function readIn() {
    /* Step 1: Take text input from a file named "infile.dat" */
    var infile_path = prompt('Enter the path to your "infile.dat" to be loaded or nothing if "infile.dat" is in your current directory: ');
//var outfile_path = prompt('Enter the path to your "outfile.dat" file to be saved or nothing if "outfile.dat" is in your current directory.\n');

    if (infile_path === '')
        infile_path = './infile.dat';

    try {
        var infile = fs.readFileSync(infile_path, "utf8");
        //console.log(infile);
    }
    catch (error) {
        return("The file doesn't exist");
    }

    var frequencies = {};
    var letters = RegExp('[^A-Za-z]');
    for (var i of infile) {
        if (letters.test(i))
            continue;
        if (i in frequencies)
            frequencies[i] += 1;
        else
            frequencies[i] = 1;
    }

    var total_chars = 0;
    for (var key in frequencies) {
        total_chars += frequencies[key];
    }
    for (var key in frequencies) {
        frequencies[key] = (frequencies[key] / total_chars) * 100;
    }
    var items = Object.keys(frequencies).map(function(key) {
        return [frequencies[key], key];
    });
    return(items);
}
/* Step 2: Construct the frequency table according to the input text read from the file:
 * The frequency's must be listed, in order, from largest (at the top) to smallest (at the bottom) */

//Done ^^ Steps one and two

/* Step 3: Using the Huffman algorithm, construct the optimal prefix binary code for the table
 * The Huffman codes will be sorted in the same manner as the one above i.e. frequency, highest to lowest */


/* Step 4: Produce the output, in the file "outfile.dat", consisting of
 * 1) The frequency table for the source text
 * 2) The Huffman code for each letter and digit in the source code
 * 3) The length of the coded message in terms of the number of bits */

function main() {
    var f = readIn();
    var  i = 0;
    var q = new priorityQueue();
    for(; i < f.length; i++){
        var node = new huffman_node(f[i][0],i,f[i][1]);
        q.enqueue(node);
    }
    var low = q.dequeue();
    var lowTwo = q.dequeue();
    var taco = new huffman_node((low.frequency + lowTwo.frequency), i++, null, low.id, lowTwo.id);
    low.parentUpdate(taco.id);
    lowTwo.parentUpdate(taco.id);
    console.log(taco);
    console.log(low);
    console.log(lowTwo);
    console.log(taco.left);


}

main();









// DONT USE THIS TRAILOR TRASH
// Create new object that stores pointers and ID
// Huffman Node should just store Frequency, Character and ID
// Change priority Q To not be so horifically inefficient
// Make priority queue operate with new objects
// Tree should be strictly pointers
//HURRAY