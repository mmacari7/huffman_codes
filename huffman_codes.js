//Anthony Rusignuolo, Michael Macari, Jon Lafleur
//Huffman Codes

var prompt = require('prompt-sync')();
var fs = require('fs');


class priorityQueue{
    //Constructor for priority Queue
    constructor(){
        this.queue = [];
    };
    //Programming for enqueue
    enqueue(node){
        // Binary Search for finding the proper location to insert the value in the queue
        if (this.queue.length === 0 || this.queue[this.queue.length - 1].frequency <= node.frequency) {
            this.queue.push(node);
        }
        else if (node.frequency <= this.queue[0].frequency) {
            this.queue.unshift(node);
        }
        else {
            var l = 0;
            var r = this.queue.length - 1;

            while (true) {
                var mid = Math.floor(l + ((r - l) / 2));
                if (node.frequency >= this.queue[mid].frequency && node.frequency <= this.queue[mid + 1].frequency) {
                    this.queue.splice(mid + 1, 0, node);
                    break;
                }
                if (node.frequency <= this.queue[mid].frequency && node.frequency >= this.queue[mid - 1].frequency) {
                    this.queue.splice(mid, 0, node);
                    break;
                }
                if (node.frequency >= this.queue[mid].frequency) {
                    l = mid + 1;
                    //i = i + Math.floor((i + 1) / 2);
                }
                else if (node.frequency <= this.queue[mid].frequency) {
                    r = mid - 1;
                    //i = Math.floor(i / 2);
                }
            }
        }
    }
    dequeue(){
        //Function for pulling the values out of the queue
        if(this.queue.length == 0){
            return("Is empty");
        }
        else{
            return(this.queue.shift());
        }
    }
}

class huffman_node{
    //Constructor for our huffman nodes
    constructor(frequency, id, symbol = null, left = null, right = null, parent = null){
        this.frequency = frequency;
        this.id = id;
        this.symbol = symbol;
        this.parent = parent;
        this.left = left;
        this.right = right;
    };
}

function readIn(folderPath) {
    /* Step 1: Take text input from a file named "infile.dat" */
    //var outfile_path = prompt('Enter the path to your "outfile.dat" file to be saved or nothing if "outfile.dat" is in your current directory.\n');

    if (folderPath === '')
        folderPath = './infile.dat';

    try {
        var infile = fs.readFileSync(folderPath, "utf8");
    }
    catch (error) {
        return ("The file doesn't exist");
    }
    // initializes and creates all variables for the input frequencies etc.
    var frequencies = {};
    var occur = {};
    var letters = RegExp('[^A-Za-z]');
    for (var i of infile) {
        if (letters.test(i))
            continue;
        if (i in frequencies) {
            frequencies[i] += 1;
            occur[i] += 1;
        }
        else {
            frequencies[i] = 1;
            occur[i] = 1;
        }
    }

    var total_chars = 0;
    for (var key in frequencies) {
        total_chars += frequencies[key];
    }
    for (var key in frequencies) {
        frequencies[key] = (frequencies[key] / total_chars) * 100;
    }
    var items = Object.keys(frequencies).map(function (key) {
        return [frequencies[key], key];
    });

    return [occur, items];
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

//Function for generating our huffman tree using the nodes in priority queue
function genTree(f){
    var  i = 0;
    var q = new priorityQueue();
    for(; i < f.length; i++){
        var node = new huffman_node(f[i][0],i,f[i][1]);
        q.enqueue(node);
    }

    var l = null;
    var r = null;
    var par = null;
    while(q.queue.length > 1){          // While the queue has more than just the root node in it
        l = q.dequeue();                // Left node removed from front of queue, least weight
        r = q.dequeue();                // Right node removed from front of queue
        par = new huffman_node((l.frequency + r.frequency), i++, null, l, r);               // Creates our parent node and sets its left and right values
        l.parent = par;                                                                     // Updates the parent of our left and right nodes
        r.parent = par;
        q.enqueue(par);                         // Reinserts new parent node in proper location in queue
    }

    var root = q.queue[0];                      // Obtains our final root node tree
    return(root);                               // Returns the root
}

// Function utilized to traverse the tree in order to generate our huffman nodes
// Recursive call creating and updating the string as 0 or 1 based on going left or right
function storeCode(root, str, arr){
    if(root.left == null && root.right == null && root.symbol != null){
        arr.push([root.symbol, root.frequency, str]);
        return;
    }
    storeCode(root.left, str+'0', arr);
    storeCode(root.right, str+'1', arr);
}

// Function to sort our table in descending order based on the frequency of the letter
function sortBy(a,b){
    if(a[1] === b[1]){
        return(0)
    }
    else{
        return(a[1] > b[1]) ? -1 : 1;
    }

}

// Function to write our table to the output file with the correct symbols, frequencies, and huffman codes
function writeTables(table, occur){
    var s = 'Symbol    Frequency   \n';
    for (var i = 0; i < table.length; i++){
        var g = table[i][1].toFixed(2);
        s += table[i][0] + '         ' + g + ' '.repeat(12 - String(g).length) + table[i][1] + '\n';
    }

    var totalBits = 0;
    for (var key = 0; key < table.length; key++) {
        totalBits += occur[table[key][0]] * table[key][2].length;
    }
    s += '\nTotal bits: ' + totalBits;

    fs.writeFile('outfile.dat', s, (err) => {
        if (err) throw err;
        console.log('File saved!');
    });
}

//Main function that uses all of our functions together in order to perform the tasks
function main() {
    var folderPath = prompt('Enter the path to your "infile.dat" to be loaded or nothing if "infile.dat" is in your current directory: ');
    var input = readIn(folderPath);
    if (input == "The file doesn't exist") {
        console.log("The file doesn't exist");
        return;
    }
    var str = '';
    var root = genTree(input[1]);
    var table = [];
    storeCode(root, str, table);
    table.sort(sortBy);

    console.log(root.left);
    writeTables(table, input[0]);
}

main();